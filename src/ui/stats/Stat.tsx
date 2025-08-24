export interface Part_t {
  text: string
  rem: number
  color: string
  weight: number
  width?: number
}

export function val(text: string, rem: number, color: string): Part_t {
  return { text, rem, color, weight: 700 }
}

export function pun(text: string, rem: number): Part_t {
  return { text, rem, color: "gray", weight: 400 }
}

export function gap(rem: number): Part_t {
  return { text: "", rem, color: "transparent", weight: 0, width: rem }
}

export const Stat = (parts: Part_t[], name?: string) => (
  <div>
    <div className="flex gap-0 items-center">
      {parts.map((d, i) => (
        <div
          key={i}
          style={{
            fontWeight: d.weight,
            color: d.color,
            fontSize: `${d.rem}rem`,
            lineHeight: 1,
            width: d.width ? `${d.width}rem` : "auto",
          }}
        >
          {d.text}
        </div>
      ))}
    </div>
    {name && <p className="text-neutral-500">{name}</p>}
  </div>
)

export const color = (ratio: number) => `hsl(${ratio * 120}, 100%, 50%)`
