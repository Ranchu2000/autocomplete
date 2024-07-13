import React, { useEffect, useState } from "react";

interface Props {
  options: string[];
  isMultiple: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilteredOptions = ({
  options,
  isMultiple,
  onChange,
  onInputChange,
}: Props) => {
  const [countSelected, setCountSelected] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  useEffect(() => {
    const initialSelectedOptions: { [key: string]: boolean } = {};
    options.forEach((option) => {
      initialSelectedOptions[option] = false;
    });
    setSelectedOptions(initialSelectedOptions);
  }, [options]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const option = event.target.value;
    const prevStateSelected = selectedOptions[option];
    if (!isMultiple && !prevStateSelected && countSelected > 0) {
      return;
    }
    if (!prevStateSelected) {
      setCountSelected((prevCountSelected) => prevCountSelected + 1);
    } else {
      setCountSelected((prevCountSelected) => prevCountSelected - 1);
    }
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [option]: !prevSelectedOptions[option],
    }));
  };

  return (
    <div className="mt-2 max-h-36 overflow-y-auto">
      {filteredOptions.map((option) => (
        <li key={option} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={option}
            checked={selectedOptions[option]}
            onChange={handleOptionChange}
          />
          <span>{option}</span>
        </li>
      ))}
    </div>
  );
};

export default FilteredOptions;
