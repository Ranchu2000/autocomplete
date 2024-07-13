import { useEffect, useState } from "react";
import useDebounce from "../utils/debounce";
import Spinner from "./Spinner";
import {
  autoUpdate,
  flip,
  useFloating,
  offset,
  shift,
} from "@floating-ui/react";

interface Props {
  description: string;
  isDisabled: boolean;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  isMultiple: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterOptions: (options: string[], inputValue: string) => string[];
  isLoading: boolean;
}

const SearchBox = ({
  description,
  isDisabled,
  label,
  placeholder,
  options,
  value,
  isMultiple,
  onChange,
  onInputChange,
  filterOptions,
  isLoading,
}: Props) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [countSelected, setCountSelected] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchedVal, setSearchedVal] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { refs, floatingStyles, context } = useFloating({
    middleware: [offset(5), flip(), shift()],
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  useEffect(() => {
    if (isOpen && refs.reference.current && refs.floating.current) {
      return autoUpdate(
        refs.reference.current,
        refs.floating.current,
        context.update
      );
    }
  }, [isOpen, refs.reference, refs.floating, context.update]);

  useEffect(() => {
    const initialSelectedOptions: { [key: string]: boolean } = {};
    options.forEach((option) => {
      initialSelectedOptions[option] = false;
    });
    setSelectedOptions(initialSelectedOptions);
  }, [options]);

  useEffect(() => {
    setSearchedVal(value);
    setFilteredOptions(filterOptions(options, value));
    setIsSearching(false);
    setIsOpen(value.length > 0);
  }, [useDebounce(value, 300), options, filterOptions]);

  const handleOptionChange = (option: string) => {
    const prevStateSelected = selectedOptions[option];
    if (!isMultiple && !prevStateSelected && countSelected > 0) {
      return;
    }
    setCountSelected((prevCount) => prevCount + (prevStateSelected ? -1 : 1));
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event);
    setIsSearching(true);
    setFocusedIndex(-1);
    setIsOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
      );
    } else if (event.key === "Enter" && focusedIndex >= 0) {
      event.preventDefault();
      handleOptionChange(filteredOptions[focusedIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && refs.floating.current) {
      const focusedElement = refs.floating.current.children[
        focusedIndex
      ] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [focusedIndex, refs.floating]);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <div>
            <span>Selected: {countSelected}</span>
            <span>Searched term: {searchedVal}</span>
          </div>
          <label>{label}</label>
          <div className="relative ring-2 rounded-md border-blue-500">
            <input
              name="SearchBox"
              disabled={isDisabled}
              placeholder={placeholder}
              onChange={handleInputChange}
              value={value}
              onKeyDown={handleKeyDown}
              ref={refs.setReference}
              className="w-full py-2 px-3 outline-none border-none bg-transparent"
            />
            {isSearching && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Spinner />
              </div>
            )}
          </div>
          {description && <p>{description}</p>}
          {isOpen && (
            <div
              ref={refs.setFloating}
              className="bg-slate-300 p-4 rounded-lg shadow-lg"
              style={{
                ...floatingStyles,
                width: "max-content",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {filteredOptions.map((option, index) => (
                <div
                  key={option}
                  className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer
                    ${focusedIndex === index && "bg-gray-200"}`}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onMouseLeave={() => setFocusedIndex(-1)}
                  onClick={() => handleOptionChange(option)}
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions[option]}
                    onChange={() => {}}
                  />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
