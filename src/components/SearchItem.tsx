interface Props {
  option: string;
  focusedIndex: number;
  index: number;
  selectedOptions: { [key: string]: boolean };
  handleOptionChange: (option: string) => void;
  setFocusedIndex: (index: number) => void;
}
const SearchItem = ({
  option,
  focusedIndex,
  index,
  selectedOptions,
  handleOptionChange,
  setFocusedIndex,
}: Props) => {
  return (
    <div
      key={option}
      className={`cursor-pointer flex justify-between relative py-3 px-7 ${
        focusedIndex === index ? "text-white bg-indigo-500" : "text-gray-900"
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
  );
};

export default SearchItem;
