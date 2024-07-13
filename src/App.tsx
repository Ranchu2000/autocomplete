import { useEffect, useState } from "react";
import "./App.css";
import SearchBox from "./components/SearchBox";
import pokemonList from "./data/catchemall.json";

function App() {
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
            filterOptions={(optionsList, inputValue) =>
              optionsList.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase())
              )
            }
            isDebounced={true}
          />
        </div>
        <div>
          <SearchBox
            label="Sync Search"
            description="Start typing to see Pokémon suggestions."
            placeholder="Type to begin searching"
            options={pokemonList}
            filterOptions={(optionsList, inputValue) =>
              optionsList.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase())
              )
            }
            isDebounced={true}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
