import { useEffect, useState } from "react";
import "./App.css";
import SearchBox from "./components/SearchBox";
import pokemonList from "./data/pokemon.json";
import SearchSettings from "./components/SearchSettings";
import DisplayOption from "./components/DisplayOption";

function App() {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [isMultiple, setIsMultiple] = useState(false);
  const [countSelected, setCountSelected] = useState<number>(0);
  useEffect(() => {
    const initialSelectedOptions: { [key: string]: boolean } = {};
    pokemonList.forEach((option) => {
      initialSelectedOptions[option] = false;
    });
    setSelectedOptions(initialSelectedOptions);
  }, [pokemonList]);

  const handleOptionChange = (option: string, prevState: boolean) => {
    setCountSelected((prevCount) => prevCount + (prevState ? -1 : 1));
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const selectedPokemon = Object.keys(selectedOptions).filter(
    (key) => selectedOptions[key]
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-8">
        Pokémon Autocomplete
      </h1>

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-8">
          <SearchBox
            label="Async Search"
            description="Start typing to see Pokémon suggestions."
            placeholder="Type to begin searching"
            options={pokemonList}
            isDebounced={true}
            selectedOptions={selectedOptions}
            onSelectOption={handleOptionChange}
            isDisabled={isDisabled}
            isMultiple={isMultiple}
            countSelected={countSelected}
          />
        </div>
        <div>
          <SearchBox
            label="Sync Search"
            description="Start typing to see Pokémon suggestions."
            placeholder="Type to begin searching"
            options={pokemonList}
            isDebounced={true}
            selectedOptions={selectedOptions}
            onSelectOption={handleOptionChange}
            isDisabled={isDisabled}
            isMultiple={isMultiple}
            countSelected={countSelected}
          />
        </div>
        <SearchSettings
          isDisabled={isDisabled}
          onToggleDisabled={() => setIsDisabled((prev) => !prev)}
          isMultiple={isMultiple}
          onToggleMultiple={() => setIsMultiple((prev) => !prev)}
        />
      </div>
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mt-4">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4 ">
          Selected Pokémon
        </h2>
        {selectedPokemon.length > 0 ? (
          <ul className="text-gray-700">
            {selectedPokemon.map((pokemon) => (
              <DisplayOption
                key={pokemon}
                pokemon={pokemon}
                handleOptionChange={handleOptionChange}
                selectedOptions={selectedOptions}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No Pokémon selected.</p>
        )}
      </div>
    </div>
  );
}

export default App;
