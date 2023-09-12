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
];

export const QueryInput = (props) => {
  const [selectedQuery, setSelectedQuery] = createSignal(0);
  const [selectedProperty, setSelectedProperty] = createSignal(
    presetQueries[0].property
  );
  const [customQuery, setCustomQuery] = createSignal('');
  const [loading, setLoading] = createSignal(false); 

  // predicates 
  const updateAvailableQueryOptions = () => {
    const availableQueryOptions = presetQueries
      .filter((preset) => preset.property === selectedProperty())
      .map((preset, index) => (
        <option key={index} value={index}>
          {preset.label}
        </option>
      ));
    return availableQueryOptions;
  };

  const availableQueryOptions = updateAvailableQueryOptions();

  const handleQueryChange = (event) => {
    const selectedIndex = parseInt(event.target.value);
    setSelectedQuery(selectedIndex);
  };

  const handlePropertyChange = (event) => {
    const selectedPropertyCode = event.target.value;
    setSelectedProperty(selectedPropertyCode);
  };

  const handlePresetQuerySubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
    const selectedPresetQuery = `SELECT ?item ?itemLabel WHERE {
      ?item wdt:${selectedProperty()} wd:${presetQueries[selectedQuery()].value};
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    } LIMIT 10`;
    try {
      await props.executeQuery(selectedPresetQuery);
    } finally {
      setLoading(false); 
    }
  };

  const handleCustomQuerySubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
    try {
      await props.executeQuery(customQuery());
    } finally {
      setLoading(false);
    }
  };

  const sampleQuery = `SELECT ?item ?itemLabel WHERE {
    ?item wdt:${presetQueries[0].property} wd:${presetQueries[0].value};
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  } LIMIT 10`;

  return (
    <div>
      <h2>SPARQL Query</h2>
      <form onSubmit={handlePresetQuerySubmit}>
        <select onChange={handleQueryChange}>
          {availableQueryOptions}
        </select>
        <select onChange={handlePropertyChange}>
          {presetQueries.map((preset, index) => (
            <option key={index} value={preset.property}>
              {preset.label}
            </option>
          ))}
        </select>
        <button type="submit">Execute Preset Query</button>
      </form>
      <form onSubmit={handleCustomQuerySubmit}>
        <textarea
          value={customQuery()}
          onInput={(e) => setCustomQuery(e.target.value)}
          placeholder="SELECT ?item ?itemLabel WHERE { ?item wdt:P31 wd:Q5; SERVICE wikibase:label { bd:serviceParam wikibase:language '[AUTO_LANGUAGE],en'. }} LIMIT 2"
          rows={5}
          cols={40}
        ></textarea>
        <p></p>
        <button type="submit">Execute Custom Query</button>
        {loading() && <div>Loading...</div>} {/* Display loading icon if loading is true */}

        
      </form>
    </div>
  );
};
