import { createSignal } from 'solid-js';

const presetQueries = [
  {
    label: 'Person',
    property: 'P31',
    value: 'Q5',
  },
  {
    label: 'City',
    property: 'P31',
    value: 'Q515',
  },
  {
    label: 'Country',
    property: 'P31',
    value: 'Q6256',
  },
  // Additional properties
  {
    label: 'Occupation',
    property: 'P106',
    value: 'Q937857',
  },
  {
    label: 'Genre',
    property: 'P136',
    value: 'Q188442',
  },
  {
    label: 'Founder',
    property: 'P112',
    value: 'Q937',
  },
  // Add more properties here
];

export const QueryInput = (props) => {
  const [selectedQuery, setSelectedQuery] = createSignal(0);
  const [selectedProperty, setSelectedProperty] = createSignal(
    presetQueries[0].property
  );
  const [customQuery, setCustomQuery] = createSignal('');
  const [customQueryExecuted, setCustomQueryExecuted] = createSignal(false);

  const availableQueryOptions = [];

  presetQueries.forEach((preset, index) => {
    if (preset.property === selectedProperty()) {
      availableQueryOptions.push(
        <option key={index} value={index}>
          {preset.label}
        </option>
      );
    }
  });

  const handleQueryChange = (event) => {
    const selectedIndex = event.target.value === 'custom' ? 'custom' : parseInt(event.target.value);
    setSelectedQuery(selectedIndex);
    setCustomQueryExecuted(false); // Reset custom query execution flag
  };

  const handlePropertyChange = (event) => {
    const selectedPropertyCode = event.target.value;
    setSelectedProperty(selectedPropertyCode);

    availableQueryOptions.length = 0;
    presetQueries.forEach((preset, index) => {
      if (preset.property === selectedPropertyCode) {
        availableQueryOptions.push(
          <option key={index} value={index}>
            {preset.label}
          </option>
        );
      }
    });

    setSelectedQuery(0);
    setCustomQueryExecuted(false); // Reset custom query execution flag
  };

  const handlePresetQuerySubmit = (event) => {
    event.preventDefault();
    const selectedPresetQuery = `SELECT ?item ?itemLabel WHERE {
      ?item wdt:${selectedProperty()} wd:${presetQueries[selectedQuery()].value};
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    } LIMIT 10`;
    props.executeQuery(selectedPresetQuery);
    setCustomQueryExecuted(false); // Reset custom query execution flag
  };

  const handleCustomQuerySubmit = (event) => {
    event.preventDefault();
    props.executeQuery(customQuery());
    setCustomQueryExecuted(true); // Set custom query execution flag
  };

  return (
    <div>
      <h2>SPARQL Query</h2>
      <form onSubmit={handlePresetQuerySubmit}>
        <select onChange={handleQueryChange}>
          {availableQueryOptions}
          <option value="custom">Custom Query</option>
        </select>
        {/* Dropdown for selecting the Wikidata property */}
        <select onChange={handlePropertyChange}>
          {presetQueries.map((preset, index) => (
            <option key={index} value={preset.property}>
              {preset.label}
            </option>
          ))}
        </select>
        <button type="submit">Execute Preset Query</button>
      </form>
      {selectedQuery() === 'custom' && (
        <form onSubmit={handleCustomQuerySubmit}>
          <input
            type="text"
            value={customQuery()}
            onInput={(e) => setCustomQuery(e.target.value)}
            placeholder="Enter custom SPARQL query"
          />
          <button type="submit">Execute Custom Query</button>
        </form>
      )}
    </div>
  );
};
