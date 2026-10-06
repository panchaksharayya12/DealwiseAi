import React, { useEffect, useState } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  charDelay?: number;
  initialDelay?: number;
  duration?: number;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  className = '',
  charDelay = 30,
  initialDelay = 200,
  duration = 500,
}) => {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasStarted(true);
    }, initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const lines = text.split('\n');

  let cumulativeIndex = 0;

  return (
    <h1 className={`font-normal tracking-[-0.04em] ${className}`}>
      {lines.map((line, lineIndex) => {
        const characters = line.split('');
        return (
          <span key={`line-${lineIndex}`} className="block">
            {characters.map((char, charIdx) => {
              const charNumber = cumulativeIndex++;
              const delay = charNumber * charDelay;
              const displayChar = char === ' ' ? '\u00A0' : char;

              return (
                <span
                  key={`char-${lineIndex}-${charIdx}`}
                  className="inline-block transition-all ease-out"
                  style={{
                    opacity: hasStarted ? 1 : 0,
                    transform: hasStarted ? 'translateX(0)' : 'translateX(-18px)',
                    transitionDuration: `${duration}ms`,
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {displayChar}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
};
