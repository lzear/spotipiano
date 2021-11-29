import React from 'react'

export const DotPulse: React.FC = () => (
  <span className="loading">
    <style jsx>{`
      .loading:after {
        overflow: hidden;
        display: inline-block;
        vertical-align: bottom;
        -webkit-animation: ellipsis steps(4, end) 900ms infinite;
        animation: ellipsis steps(4, end) 900ms infinite;
        content: '...';
        width: 0px;
      }

      @keyframes ellipsis {
        to {
          width: 1.25em;
        }
      }

      @-webkit-keyframes ellipsis {
        to {
          width: 1.25em;
        }
      }
    `}</style>
  </span>
)
