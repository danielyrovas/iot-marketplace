import { createSignal } from 'solid-js';

const presetQueries = [
  {
    label: 'Person',
    property: 'P31', // Property code for 'instance of'
    value: 'Q5',     // Value code for 'human'
  },
  {
    label: 'City',
    property: 'P31', // Property code for 'instance of'
    value: 'Q515',   // Value code for 'city'
  },
  {
    label: 'Country',
    property: 'P31', // Property code for 'instance of'
    value: 'Q6256',  // Value code for 'country'
  },
  // Additional properties
  {
    label: 'Occupation',
    property: 'P106', // Property code for 'occupation'
    value: 'Q937857', // Value code for 'software developer'
  },
  {
    label: 'Genre',
    property: 'P136', // Property code for 'genre'
    value: 'Q188442', // Value code for 'science fiction film'
  },
  {
    label: 'Founder',
    property: 'P112', // Property code for 'founder'
    value: 'Q937',    // Value code for 'Elon Musk'
  },
  // Add 3 more properties here
  {
    label: 'Architect',
    property: 'P106', // Property code for 'occupation'
    value: 'Q42973', // Value code for 'architect'
  },
  {
    label: 'Language',
    property: 'P407', // Property code for 'language of work or name'
    value: 'Q1860',  // Value code for 'English'
  },
  {
    label: 'Director',
    property: 'P57',  // Property code for 'director'
    value: 'Q937',    // Value code for 'Elon Musk' (example)
  },
];

export const QueryInput = (props) => {
  const [selectedQuery, setSelectedQuery] = createSignal(0);
  const [selectedProperty, setSelectedProperty] = createSignal(
    presetQueries[0].property
  );

  // Initialize available query options with the options for the default property
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
    const selectedIndex = event.target.selectedIndex;
    setSelectedQuery(selectedIndex);
  };

  const handlePropertyChange = (event) => {
    const selectedPropertyCode = event.target.value;
    setSelectedProperty(selectedPropertyCode);

    // Filter the available query options based on the selected property
    availableQueryOptions.length = 0; // Clear the array
    presetQueries.forEach((preset, index) => {
      if (preset.property === selectedPropertyCode) {
        availableQueryOptions.push(
          <option key={index} value={index}>
            {preset.label}
          </option>
        );
      }
    });

    // Select the first available query by default
    setSelectedQuery(0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedPresetQuery = `SELECT ?item ?itemLabel WHERE {
      ?item wdt:${selectedProperty()} wd:${presetQueries[selectedQuery()].value};
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    } LIMIT 10`;
    props.executeQuery(selectedPresetQuery);
    console.log(props);
  };

  return (
    <div>
      <h2>SPARQL Query</h2>
      <form onSubmit={handleSubmit}>
        <select onChange={handleQueryChange}>
          {availableQueryOptions}
        </select>
        {/* Dropdown for selecting the Wikidata property */}
        <select onChange={handlePropertyChange}>
          {presetQueries.map((preset, index) => (
            <option key={index} value={preset.property}>
              {preset.label}
            </option>
          ))}
          {/* Add more property options here */}
        </select>
        <button type="submit">Execute Query</button>
      </form>
    </div>
  );
};
