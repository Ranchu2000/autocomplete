import trashIcon from "../assets/trash.png";

interface Props {
  pokemon: string;
  handleOptionChange: (option: string, prevState: boolean) => void;
  selectedOptions: { [key: string]: boolean };
}
const DisplayOption = ({
  pokemon,
  handleOptionChange,
  selectedOptions,
}: Props) => {
  return (
    <div key={pokemon} className="py-4 flex items-center justify-between">
      {pokemon}
      <img
        src={trashIcon}
        alt="search icon"
        className="w-7 h-7 cursor-pointer"
        onClick={() => handleOptionChange(pokemon, selectedOptions[pokemon])}
      />
    </div>
  );
};

export default DisplayOption;
