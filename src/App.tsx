import { useEffect, useState } from "react";
import "./App.css";
import SearchBox from "./components/SearchBox";
import pokemonList from "./data/catchemall.json";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchBoxDisabled, setsearchBoxDisabled] = useState(false);
  const [searchBoxMultiple, setsearchBoxMultiple] = useState(false);
  const [searchBoxContent, setsearchBoxContent] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // onChange only fires when the modified text is actually different. onInput fires whenever there is an input, even if that input doesn't change the value
  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsearchBoxContent(event.target.value);
  };
  return (
    <>
      <h1>Vite + React</h1>
      <label>
        isDisabled:{" "}
        <input
          type="checkbox"
          name="isDisabledCheckbox"
          checked={searchBoxDisabled}
          onChange={() => setsearchBoxDisabled(!searchBoxDisabled)}
        />
      </label>
      <label>
        isMultiple:{" "}
        <input
          type="checkbox"
          name="isMultipleCheckbox"
          checked={searchBoxMultiple}
          onChange={() => setsearchBoxMultiple(!searchBoxMultiple)}
        />
      </label>
      <div className="flex-auto w-64 bg-slate-300 p-4 rounded-lg shadow-lg">
        <SearchBox
          description="this is a description"
          isDisabled={searchBoxDisabled}
          isMultiple={searchBoxMultiple}
          placeholder="Search name"
          options={pokemonList}
          value={searchBoxContent}
          onChange={onSearchBoxChange}
          onInputChange={onSearchBoxChange}
          filterOptions={(optionsList, inputValue) =>
            optionsList.filter((option) =>
              option.toLowerCase().includes(inputValue)
            )
          }
          label="this is a label"
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

export default App;
