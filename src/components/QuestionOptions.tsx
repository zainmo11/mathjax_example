import React, { useEffect, useRef, useState } from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

interface Option {
  id: string;
  text: string;
}

interface QuestionOptionsProps {
  options: Option[];
}

const mathJaxConfig = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
  },
  messageStyle: "none",
  showProcessingMessages: false,
  showMathMenu: false,
  "HTML-CSS": {
    linebreaks: { automatic: true },
    availableFonts: ["TeX"],
    preferredFont: "TeX"
  },
  SVG: { linebreaks: { automatic: true } }
};

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({ options }) => {
  const [displayStyle, setDisplayStyle] = useState<'single' | 'double' | 'stacked'>('single');
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    const checkInterval = 100;

    const checkForElements = () => {
      if (attempts >= maxAttempts) {
        console.warn('MathJax elements not found after maximum attempts');
        return;
      }

      const elements = document.querySelectorAll('[data-option-id]');
      if (elements.length > 0) {
        setRendered(true);
      } else {
        attempts++;
        setTimeout(checkForElements, checkInterval);
      }
    };

    // Start checking for elements
    checkForElements();

    return () => {
      attempts = maxAttempts; // Stop checking on unmount
    };
  }, [options]);

  useEffect(() => {
    if (!rendered) return;

    const checkWidth = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;

      // Create a temporary div for measuring
      const tempContainer = document.createElement('div');
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.className = 'options-container';
      document.body.appendChild(tempContainer);

      // Measure single line layout
      const singleLine = document.createElement('div');
      singleLine.className = 'flex flex-wrap gap-4';
      tempContainer.appendChild(singleLine);

      options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'inline-flex items-center';
        const sourceEl = container.querySelector(`[data-option-id="${option.id}"]`);
        optionEl.innerHTML = sourceEl?.innerHTML || '';
        singleLine.appendChild(optionEl);
      });

      const singleLineWidth = singleLine.offsetWidth;

      // Measure double line layout
      const doubleLine = document.createElement('div');
      doubleLine.className = 'grid grid-cols-2 gap-4';
      tempContainer.innerHTML = '';
      tempContainer.appendChild(doubleLine);

      const rows = Math.ceil(options.length / 2);
      let maxDoubleWidth = 0;

      for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'col-span-2 flex gap-4';

        const option1 = options[i * 2];
        const option2 = options[i * 2 + 1];

        if (option1) {
          const opt1El = document.createElement('div');
          opt1El.className = 'flex-1';
          const sourceEl1 = container.querySelector(`[data-option-id="${option1.id}"]`);
          opt1El.innerHTML = sourceEl1?.innerHTML || '';
          row.appendChild(opt1El);
        }

        if (option2) {
          const opt2El = document.createElement('div');
          opt2El.className = 'flex-1';
          const sourceEl2 = container.querySelector(`[data-option-id="${option2.id}"]`);
          opt2El.innerHTML = sourceEl2?.innerHTML || '';
          row.appendChild(opt2El);
        }

        doubleLine.appendChild(row);
        maxDoubleWidth = Math.max(maxDoubleWidth, row.offsetWidth);
      }

      document.body.removeChild(tempContainer);

      // Determine display style based on measurements
      if (singleLineWidth <= containerWidth) {
        setDisplayStyle('single');
      } else if (maxDoubleWidth <= containerWidth) {
        setDisplayStyle('double');
      } else {
        setDisplayStyle('stacked');
      }
    };

    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [options, rendered]);

  const renderText = (text: string) => {
    return <MathJax dynamic style={{ display: "inline" }}>{text}</MathJax>;
  };

  const OptionsContent = () => {
    if (displayStyle === 'single') {
      return (
        <div className="flex flex-wrap gap-4">
          {options.map((option, index) => (
            <div key={option.id} className="inline-flex items-center" data-option-id={option.id}>
              <span className="font-medium">{option.id}.</span>
              <span className="ml-1">{renderText(option.text)}</span>
              {index < options.length - 1 && <span className="ml-4"></span>}
            </div>
          ))}
        </div>
      );
    }

    if (displayStyle === 'double') {
      return (
        <div className="grid grid-cols-2 gap-y-4">
          {Array.from({ length: Math.ceil(options.length / 2) }).map((_, rowIndex) => (
            <div key={rowIndex} className="col-span-2 flex gap-4">
              {options.slice(rowIndex * 2, rowIndex * 2 + 2).map((option) => (
                <div key={option.id} className="flex-1 flex items-center" data-option-id={option.id}>
                  <span className="font-medium">{option.id}.</span>
                  <span className="ml-1 " >{renderText(option.text)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <div key={option.id} data-option-id={option.id}>
            <span className="font-medium">{option.id}.</span>
            <span className="ml-1">{renderText(option.text)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div ref={containerRef} className="options-container">
        <OptionsContent />
      </div>
    </MathJaxContext>
  );
};
