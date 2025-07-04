import React, { useEffect, useRef } from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface HandwrittenRadioProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const RadioButtons: React.FC<HandwrittenRadioProps> = ({
  name,
  options,
  value,
  onChange,
  className = '',
}) => {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    // ランダムな手書き感を追加
    const paths = pathRefs.current;
    paths.forEach((path) => {
      if (path) {
        path.addEventListener('animationstart', function () {
          const randomRotate = (Math.random() - 0.5) * 4;
          this.style.transform = `rotate(${randomRotate}deg)`;
        });
      }
    });

    return () => {
      paths.forEach((path) => {
        if (path) {
          path.removeEventListener('animationstart', () => {});
        }
      });
    };
  }, []);

  const handleChange = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <div className={`radio-container ${className}`}>
      {options.map((option, index) => (
        <div key={option.value}>
          <label className="radio-label">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              className="radio-input"
            />
            <div className="checkmarkArea">
              <div className="w-[1rem] h-[1rem] border-2 rounded-sm" />
              <svg className="checkmark" viewBox="0 0 40 40" preserveAspectRatio="xMidYMid meet">
                <path
                  ref={(el) => {
                    if (el) {
                      pathRefs.current[index] = el;
                    }
                  }}
                  className="checkmarkPath"
                  d="M8 20 L16 28 L32 12"
                />
              </svg>
            </div>
            <span className="text-sm text-black">{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButtons;
