export default function CurveText() {
  const CX = 80
  const CY = 80
  const R = 65

  // const radius = 60 // Radius of the circle
  // const cx = 80 // Center x-coordinate
  // const cy = 80 // Center y-coordinate
  const bigTickLength = 15 // Length of the big ticks
  const smallTickLength = 7 // Length of the small ticks

  // Function to generate the ticks
  const generateTicks = (cx: number, cy: number, radius: number) => {
    const ticks = []
    for (let angle = 0; angle < 360; angle += 10) {
      const isBigTick = angle % 30 === 0
      const tickLength = isBigTick ? bigTickLength : smallTickLength

      // Convert angle to radians
      const radian = (angle * Math.PI) / 180

      // Start of the tick
      const x1 = cx + radius * Math.cos(radian)
      const y1 = cy + radius * Math.sin(radian)

      // End of the tick (slightly inside the circle)
      const x2 = cx + (radius - tickLength) * Math.cos(radian)
      const y2 = cy + (radius - tickLength) * Math.sin(radian)

      ticks.push(<line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="red" strokeWidth={isBigTick ? 2 : 1} />)
    }
    return ticks
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="160px" height="160px">
      <g>
        <path
          id="titlepath"
          fill="none"
          d={`M ${CX - R} ${CY}
              a ${R} ${R} 0 0 1 ${R * 2} 0 
              a ${R} ${R} 0 0 1 -${R * 2} 0 
              `}
        />

        <circle cx="80" cy="80" r="40" fill="none" id="circle" />
        {generateTicks(80, 80, 60)}

        <text fill="orange">
          <textPath href="#titlepath" startOffset={(Math.PI * R - 140) / 2} className="text-lg font-bold">
            ROBOT MOTION
          </textPath>
        </text>
      </g>
    </svg>
  )
}
