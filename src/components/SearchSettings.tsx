interface Props {
  isDisabled: boolean;
  onToggleDisabled: () => void;
  isMultiple: boolean;
  onToggleMultiple: () => void;
}
const SearchSettings = ({
  isDisabled,
  onToggleDisabled,
  isMultiple,
  onToggleMultiple,
}: Props) => {
  return (
    <div className="flex justify-center mb-4 space-x-4 ">
      <label>
        <input
          type="checkbox"
          name="isDisabledCheckbox"
          checked={isDisabled}
          onChange={onToggleDisabled}
          className="mr-1.5"
        />
        Disabled
      </label>
      <label>
        <input
          type="checkbox"
          name="isMultipleCheckbox"
          checked={isMultiple}
          onChange={onToggleMultiple}
          className="mr-1.5"
        />
        Multiple
      </label>
    </div>
  );
};

export default SearchSettings;
