import { createSignal } from 'solid-js';

interface QueryInputProps {
  executeQuery: (query: string) => void;
}

const presetQueries = [
  {
    label: 'Person',
    query: `SELECT ?person ?personLabel WHERE {
      ?person wdt:P19 wd:Q84;
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    } LIMIT 10`,
  },
  {
    label: 'City',
    query: `SELECT ?city ?cityLabel WHERE {
      ?city wdt:P31 wd:Q515.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    } LIMIT 10`,
  },
  {
    label: 'Country',
    query: `SELECT ?country ?countryLabel WHERE {
      ?country wdt:P31 wd:Q6256.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    } LIMIT 10`,
  },
];

export const QueryInput = (props: QueryInputProps) => {
  const [selectedQuery, setSelectedQuery] = createSignal(0);

  const handleQueryChange = (event: Event) => {
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    setSelectedQuery(selectedIndex);
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const selectedPresetQuery = presetQueries[selectedQuery()].query;
    props.executeQuery(selectedPresetQuery);
  };

  return (
    <div>
      <h2>SPARQL Query</h2>
      <form onSubmit={handleSubmit}>
        <select onChange={handleQueryChange}>
          {presetQueries.map((preset, index) => (
            <option key={index} value={index}>
              {preset.label}
            </option>
          ))}
        </select>
        <button type="submit">Execute Query</button>
      </form>
    </div>
  );
};
