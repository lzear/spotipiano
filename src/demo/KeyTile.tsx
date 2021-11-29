import { animated, SpringValue, useSpring } from '@react-spring/web'
import React, { useEffect } from 'react'
import cx from 'classnames'

const transform = (s: number) => `perspective(600px) scale(${s})`

const Gauge: React.FC<{
  radius: number
  progress: number | SpringValue<number>
  stroke: number
}> = ({ radius, progress, stroke }) => {
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  let circle
  if (typeof progress === 'number') {
    const strokeDashoffset = circumference - progress * circumference
    circle = (
      <circle
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        stroke="black"
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    )
  } else if (progress) {
    circle = (
      <animated.circle
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        stroke="black"
        fill="transparent"
        style={{
          strokeDashoffset: progress.to([0, 1], [circumference, 0]),
        }}
      />
    )
  }

  return (
    <svg height={radius * 2} width={radius * 2}>
      {circle}
      <style jsx>
        {`
          svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-90deg);
            transform-origin: 50% 50%;
          }
        `}
      </style>
    </svg>
  )
}

export const KeyTile: React.FC<{
  color?: string
  url?: string
  letter?: string
  progress?: number | SpringValue<number> | null
  className?: string
  size?: number
}> = ({ url, progress, letter, className, size = 64, color }) => (
  <div className={cx('key', className)}>
    <span className="text">
      {letter?.toUpperCase()}
      {!!progress && <Gauge radius={30} stroke={1} progress={progress} />}
    </span>
    <style jsx>{`
      .img {
        display: block;
      }
      .key {
      
            transition: background-image 0.1s ease-in-out,
        height: ${size}px;
        width: ${size}px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .text {
        user-select: none;
        position: absolute;
        mix-blend-mode: difference;
        filter: invert(1);
        color: black;
        font-size: 3rem;
        font-weight: bold;
        line-height: 100%;
      }
    `}</style>
    <style jsx>{`
      .key {
        height: ${size}px;
        width: ${size}px;
        background-image: url(${url});
        background-color: ${color};
      }
    `}</style>
  </div>
)
export const SpringKey: React.FC<{
  onClick: () => void
  url?: string
  color?: string
  letter?: string
  progress?: number
  // lastPressed: LastPressedType | null
  isLastPressedAt: false | number
  defaulted?: boolean
}> = ({
  color,
  onClick,
  progress,
  letter,
  url,
  isLastPressedAt,
  defaulted,
}) => {
  const [spring] = useSpring(() => ({ s: 1 }))
  useEffect(() => {
    if (isLastPressedAt) void spring.s.start({ from: 1.5, to: 1 })
  }, [isLastPressedAt, spring.s])

  return (
    <div
      className="key"
      style={{
        zIndex: isLastPressedAt ? 2 : 1,
        opacity: defaulted ? 0.7 : 1,
      }}
    >
      <animated.div
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onClick()
        }}
        onClick={() => onClick()}
        style={{
          transform: spring.s.to(transform),
          cursor: 'pointer',
        }}
      >
        <KeyTile color={color} url={url} letter={letter} progress={progress} />
      </animated.div>
      <style jsx>{`
        .key {
          height: 64px;
          width: 64px;
          margin: 3px;
        }
      `}</style>
    </div>
  )
}
