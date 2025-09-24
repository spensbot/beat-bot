import logo from "@/assets/logo.svg"

export default function Title() {
  const w = "5rem"
  const hueRotate = 300 // degrees

  return (
    <div className="flex gap-2 justify-center items-center">
      <img
        src={logo}
        alt="BeatBot logo"
        style={{
          width: w,
          height: w,
          filter: `hue-rotate(${hueRotate}deg)`,
        }}
      />
      <div className="flex gap-2 justify-center items-end">
        <h1 className="text-5xl font-mono">BeatBot</h1>
        <p className="text-neutral-500">rhythm coach</p>
      </div>
    </div>
  )
}
