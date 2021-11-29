import React from 'react'

export const ProgressIndicator: React.FC<{ active: boolean }> = ({
  active,
}) => (
  <div>
    {active && (
      <svg
        version="1.1"
        width="100%"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -2 800 14"
        preserveAspectRatio="none"
        style={{ height: 20, overflow: 'hidden' }}
      >
        <path
          className="path"
          stroke="#7ea695"
          fill="transparent"
          strokeWidth="2"
          d="M 0 0
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10
          l 10 10 l 10 -10"
        />
      </svg>
    )}
    <style jsx>
      {`
        div {
          height: 20px;
        }
        .path {
          stroke-dasharray: 141.421356237;
          animation: dash 1s infinite linear;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -282.842712475;
          }
        }
      `}
    </style>
  </div>
)
