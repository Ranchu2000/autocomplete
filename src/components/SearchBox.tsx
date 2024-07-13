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
import logo from "../assets/search.png";

interface Props {
  description: string;
  label: string;
  placeholder: string;
  options: string[];
  isDebounced: boolean;
  filterOptions: (options: string[], inputValue: string) => string[];
}

const SearchBox = ({
  description,
  label,
  placeholder,
  options,
  isDebounced,
  filterOptions,
}: Props) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [countSelected, setCountSelected] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [_, setSearchedVal] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [searchBoxContent, setsearchBoxContent] = useState<string>("");

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
    setSearchedVal(searchBoxContent);
    setFilteredOptions(filterOptions(options, searchBoxContent));
    setIsSearching(false);
    setIsOpen(searchBoxContent.length > 0);
  }, [
    useDebounce(searchBoxContent, isDebounced ? 300 : 0),
    options,
    filterOptions,
  ]);

  const handleOptionChange = (option: string) => {
    const prevStateSelected = selectedOptions[option];
    if (!isMultiple && !prevStateSelected && countSelected > 0) {
      alert("Only one option can be selected");
      return;
    }
    setCountSelected((prevCount) => prevCount + (prevStateSelected ? -1 : 1));
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsearchBoxContent(event.target.value);
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
      clearSearchBox();
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

  const clearSearchBox = () => {
    setsearchBoxContent("");
    setFilteredOptions([]);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="text-lg font-medium text-indigo-500">{label}</label>
      <div className="relative my-2">
        <div className=" flex w-full py-3 pl-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <img src={logo} alt="search icon" className="w-7 h-7" />
          <input
            name="SearchBox"
            disabled={isDisabled}
            placeholder={placeholder}
            onChange={handleInputChange}
            value={searchBoxContent}
            onKeyDown={handleKeyDown}
            ref={refs.setReference}
            className="w-full outline-none px-3"
            style={{ textDecoration: "none" }} //remove underline
          />
          {isSearching && (
            <div className="pr-2">
              <Spinner />
            </div>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-500 mb-4">{description}</p>
        )}
        {isOpen && (
          <div
            ref={refs.setFloating}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            style={{
              ...floatingStyles,
            }}
          >
            {filteredOptions.map((option, index) => (
              <div
                key={option}
                className={`cursor-pointer flex justify-between  relative py-3 px-7 ${
                  focusedIndex === index
                    ? "text-white bg-indigo-500"
                    : "text-gray-900"
                }`}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseLeave={() => setFocusedIndex(-1)}
                onClick={() => handleOptionChange(option)}
                role="option"
                aria-selected={focusedIndex === index}
              >
                <span
                  className={`${
                    focusedIndex === index ? "font-semibold" : "font-normal"
                  }`}
                >
                  {option}
                </span>
                <input
                  type="checkbox"
                  checked={selectedOptions[option]}
                  className={`form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mb-4 space-x-4 ">
        <label>
          <input
            type="checkbox"
            name="isDisabledCheckbox"
            checked={isDisabled}
            onChange={() => setIsDisabled(!isDisabled)}
            className="mr-1.5"
          />
          Disabled
        </label>
        <label>
          <input
            type="checkbox"
            name="isMultipleCheckbox"
            checked={isMultiple}
            onChange={() => setIsMultiple(!isMultiple)}
            className="mr-1.5"
          />
          Multiple
        </label>
      </div>
    </div>
  );
};

export default SearchBox;
