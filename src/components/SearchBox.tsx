import { useEffect, useState } from "react";
import useDebounce from "../utils/debounce";
import {
  autoUpdate,
  flip,
  useFloating,
  offset,
  shift,
} from "@floating-ui/react";
import SearchInput from "./SearchInput";
import SearchItem from "./SearchItem";

interface Props {
  description: string;
  label: string;
  placeholder: string;
  options: string[];
  isDebounced: boolean;
  selectedOptions: { [key: string]: boolean };
  onSelectOption: (option: string, prevState: boolean) => void;
  isDisabled: boolean;
  isMultiple: boolean;
  countSelected: number;
}

const SearchBox = ({
  description,
  label,
  placeholder,
  options,
  isDebounced,
  selectedOptions,
  onSelectOption,
  isMultiple,
  isDisabled,
  countSelected,
}: Props) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [_, setSearchedVal] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    setSearchedVal(searchBoxContent);
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchBoxContent.toLowerCase())
      )
    );
    setIsSearching(false);
    setIsOpen(searchBoxContent.length > 0);
  }, [useDebounce(searchBoxContent, isDebounced ? 300 : 0), options]);

  const handleOptionChange = (option: string) => {
    const prevStateSelected = selectedOptions[option];
    if (!isMultiple && !prevStateSelected && countSelected > 0) {
      alert("Only one option can be selected");
      return;
    }
    onSelectOption(option, prevStateSelected);
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
  }, [focusedIndex]);

  const clearSearchBox = () => {
    setsearchBoxContent("");
    setFilteredOptions([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-lg font-medium text-indigo-500">{label}</label>
      <div>
        <SearchInput
          placeholder={placeholder}
          disabled={isDisabled}
          value={searchBoxContent}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          setReference={refs.setReference}
          isSearching={isSearching}
          onBlur={clearSearchBox}
        />

        {isOpen && (
          <div
            ref={refs.setFloating}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
            style={{
              ...floatingStyles,
            }}
          >
            {filteredOptions.map((option, index) => (
              <SearchItem
                key={option}
                option={option}
                focusedIndex={focusedIndex}
                index={index}
                selectedOptions={selectedOptions}
                handleOptionChange={handleOptionChange}
                setFocusedIndex={setFocusedIndex}
              />
            ))}
          </div>
        )}
        {description && (
          <p className="text-sm text-gray-500 mb-4">{description}</p>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
