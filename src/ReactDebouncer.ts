/*
  In general this hook will be useful for search fields realization. 
  For example before search, you will need to allow user finish typing search text 
  and only after that send request to server and run loading, So put this 
*/

export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return debouncedValue;
}


// Example of usage

function someReactFC() {
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 600);

  function searchForText(text: string) {
    // ... do some requests and other search stuff
  }

  useEffect(() => {
    searchForText(debouncedSearchText)
  }, [debouncedSearchText])
}


// I don't want to add react in project just for this.

function useState(a: any) {
  return [a, (b: any) => b]
}

function useEffect(f: () => any, a: any[]) {

}