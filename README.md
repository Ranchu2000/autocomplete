# Autocomplete submission

Explanation of changes:

| **Name**         | **Changes**                             | **Comments**|
|------------------|-----------------------------------------|---------------------------------------------------------------------------------------------------|
| `description`|Same|NA|
| `disabled`|Same|NA|
| `filterOptions`|Removed|Filtering logic embedded in actual component for simplicity |
| `label`|Same|NA|
| `loading`|Removed|Debounce logic managed in component and consequently loading state|
| `multiple`|Same|NA|
| `onChange`|Removed|Management of search box text managed in component, while filtered option done by parent component|
| `onInputChange`|Removed|Redundant- same as onChange|
| `options*`|Same| List of string used|                                                                                                                                      
| `placeholder`|Same|NA|
| `renderOption`|Changed|Renamed to isDebounced|
| `value`|Changed|Renamed to selectedOptions|
| `selectedOptions`|Added|Both search boxes using the same selected options to display selection below|
| `onSelectOption`|Added|Same rational as `selectedOptions`|
| `countSelected`|Added|Prevent multiple selction when isMultiple is false|

## Run the code

```sh
bun install
bun run dev
```
