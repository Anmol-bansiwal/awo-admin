import React from 'react';

interface AwoLogoProps {
  className?: string;
  showDots?: boolean;
}

export const AwoLogo: React.FC<AwoLogoProps> = ({
  className = 'w-8 h-8',
  showDots = false,
}) => {
  return (
    <svg
      viewBox={showDots ? '0 0 400 200' : '45 100 260 95'}
      className={className}
    >
      <defs>
        <linearGradient id="awoLogoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#46b94e' }} />
          <stop offset="100%" style={{ stopColor: '#38a140' }} />
        </linearGradient>
        <filter id="awoLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g transform="translate(50, 50)">
        {/* "a" path */}
        <path
          d="M70 100c0 16.568-13.431 30-30 30S10 116.568 10 100s13.431-30 30-30 30 13.431 30 30z M70 70v60"
          fill="none"
          stroke="#2D2D2D"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="2s"
            from="0, 500"
            to="500, 0"
            repeatCount="indefinite"
          />
        </path>

        {/* "w" path */}
        <path
          d="M90 70l20 60 20-40 20 40 20-60"
          fill="none"
          filter="url(#awoLogoGlow)"
          stroke="url(#awoLogoGradient)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        >
          <animate
            attributeName="stroke-dashoffset"
            dur="2s"
            repeatCount="indefinite"
            values="500; 0"
          />
          <animate
            attributeName="stroke-dasharray"
            dur="2s"
            repeatCount="indefinite"
            values="0, 500; 500, 0"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="2s"
            repeatCount="indefinite"
            values="0,0; 0,-5; 0,0"
          />
        </path>

        {/* "o" path */}
        <path
          d="M240 100c0 16.568-13.431 30-30 30s-30-13.432-30-30 13.431-30 30-30 30 13.432 30 30z"
          fill="none"
          stroke="#2D2D2D"
          strokeLinecap="round"
          strokeWidth="20"
        >
          <animate
            attributeName="stroke-dasharray"
            begin="0.2s"
            dur="2s"
            from="0, 500"
            to="500, 0"
            repeatCount="indefinite"
          />
        </path>

        {/* Loading Dots */}
        {showDots && (
          <>
            <circle cx="125" cy="160" r="6" fill="#46b94e">
              <animate
                attributeName="opacity"
                dur="1s"
                repeatCount="indefinite"
                values="0;1;0"
              />
            </circle>
            <circle cx="150" cy="160" r="6" fill="#46b94e">
              <animate
                attributeName="opacity"
                begin="0.2s"
                dur="1s"
                repeatCount="indefinite"
                values="0;1;0"
              />
            </circle>
            <circle cx="175" cy="160" r="6" fill="#46b94e">
              <animate
                attributeName="opacity"
                begin="0.4s"
                dur="1s"
                repeatCount="indefinite"
                values="0;1;0"
              />
            </circle>
          </>
        )}
      </g>
    </svg>
  );
};

interface AwoLoaderProps {
  fullScreen?: boolean;
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AwoLoader: React.FC<AwoLoaderProps> = ({
  fullScreen = false,
  message,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-32 h-16',
    md: 'w-64 h-32',
    lg: 'w-96 h-48',
  }[size];

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeClasses}`}>
        <AwoLogo className="w-full h-full drop-shadow-md" showDots={true} />
      </div>

      {message && (
        <p className="mt-3 text-sm font-semibold text-slate-600 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-md transition-opacity duration-300">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};
