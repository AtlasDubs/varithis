import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface AttributeSliderProps {
  attribute: string;
  value: number;
  label: string;
  onChange: (value: number) => void;
  maxValue: number;
  disabled?: boolean;
}

export default function AttributeSlider({ 
  attribute, 
  value, 
  label, 
  onChange, 
  maxValue, 
  disabled = false 
}: AttributeSliderProps) {
  const [attributeValue, setAttributeValue] = useState<number>(value);

  useEffect(() => {
    setAttributeValue(value);
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    const value = newValue[0];
    setAttributeValue(value);
    onChange(value);
  };

  return (
    <div className="form-group">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={`attr-${attribute}`} className="text-dark/80 dark:text-light-DEFAULT/80 text-sm">
          {label}
        </label>
        <span className="text-primary font-semibold" id={`${attribute}-value`}>
          {attributeValue}
        </span>
      </div>
      <Slider
        id={`attr-${attribute}`}
        value={[attributeValue]}
        min={1}
        max={maxValue}
        step={1}
        onValueChange={handleSliderChange}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}
