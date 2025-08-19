import * as z from 'zod'
import { Result, ok, err } from 'neverthrow'
import debounce from 'lodash.debounce'

interface Config {
  debounce_s: number
  maxWait_s: number
  save?: (key: string, value: string) => void
  load?: (key: string) => string | null
}

type SchemaMap = Record<string, z.ZodTypeAny>

export class SaveManager<Schemas extends SchemaMap> {
  private debouncedSavers = new Map<
    keyof Schemas,
    (value: unknown) => void
  >()
  private save: (key: string, value: string) => void
  private loadFn: (key: string) => string | null

  constructor(
    public readonly config: Config,
    private readonly schemas: Schemas
  ) {
    this.save = config.save ?? ((key: string, value: string) => localStorage.setItem(key, value))
    this.loadFn = config.load ?? ((key: string) => localStorage.getItem(key))
    window.addEventListener('pagehide', () => this.flushAll())
    window.addEventListener('beforeunload', () => this.flushAll())
  }

  stateUpdated<K extends keyof Schemas>(key: K, value: z.infer<Schemas[K]>) {
    let saver = this.debouncedSavers.get(key)
    if (!saver) {
      // Create debounced saver for this key
      saver = debounce(
        (val: unknown) => this.saveKey(key, val),
        this.config.debounce_s * 1000,
        { maxWait: this.config.maxWait_s * 1000 }
      )
      this.debouncedSavers.set(key, saver)
    }
    saver(value)
  }

  load<K extends keyof Schemas>(key: K): Result<z.infer<Schemas[K]>, Error> {
    try {
      const raw = this.loadFn(String(key))
      if (raw === null) {
        return err(new Error(`Key "${String(key)}" not found`))
      }

      const parsed = JSON.parse(raw)
      const schema = this.schemas[key]
      const result = schema.safeParse(parsed)

      if (!result.success) {
        return err(new Error(`Validation failed for key "${String(key)}": ${result.error.message}`))
      }

      return ok(result.data)
    } catch (e) {
      console.error('Error loading state:', e)
      return err(e instanceof Error ? e : new Error(String(e)))
    }
  }

  private saveKey<K extends keyof Schemas>(key: K, value: unknown) {
    try {
      this.save(String(key), JSON.stringify(value))
    } catch (e) {
      console.error(`Error saving key "${String(key)}":`, e)
    }
  }

  private flushAll() {
    for (const [key, saver] of this.debouncedSavers) {
      (saver as any).flush?.()
    }
  }
}
