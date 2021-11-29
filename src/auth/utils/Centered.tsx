import React from 'react'

export const Centered: React.FC = ({ children }) => (
  <div className="splash">
    {children}
    <style jsx>{`
      .splash {
        flex: 1 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
)
