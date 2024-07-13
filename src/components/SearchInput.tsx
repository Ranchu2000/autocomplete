import React from "react";
import { ReferenceType } from "@floating-ui/react";
import searchIcon from "../assets/search.png";
import Spinner from "./Spinner";

interface Props {
  placeholder: string;
  disabled: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setReference: (node: ReferenceType | null) => void;
  isSearching: boolean;
  onBlur: () => void;
}

const SearchInput = ({
  placeholder,
  disabled,
  value,
  onChange,
  onKeyDown,
  setReference,
  isSearching,
  onBlur,
}: Props) => {
  return (
    <div
      ref={setReference}
      onBlur={onBlur}
      className={`flex w-full py-3 px-3 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm ${
        disabled ? "bg-gray-100 text-gray-500" : "bg-white"
      }`}
    >
      <img src={searchIcon} alt="search icon" className="w-7 h-7" />
      <input
        name="SearchInput"
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        onKeyDown={onKeyDown}
        className="w-full outline-none px-3"
        style={{ textDecoration: "none" }} // remove underline
      />
      {isSearching && (
        <div className="pr-2">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default SearchInput;
