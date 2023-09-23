import { createSignal } from 'solid-js';

const presetQueries = [
  {
    label: 'All Sensor',
    property: 'observes',
    value: '',
  },
  {
    label: 'Camera Sensors',
    property: 'observes',
    value: 'FILTER (?measures = "video")',
  },
  {
    label: 'Milk temperature',
    property: 'observes',
    value: 'FILTER (?measures = "Milk Temperature")',
  },
  {
    label: 'Milk Pressure',
    property: 'observes',
    value: 'FILTER (?measures = "milk pressure")',
  },
  {
    label: 'Relative air Humidity',
    property: 'observes',
    value: 'FILTER (?measures = "relative air Humidity")',
  },


];
const queryAllData = `
PREFIX sosa: <http://www.w3.org/ns/sosa/>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>

SELECT ?sensor ?lat ?long ?measures
WHERE {
  ?sensor a sosa:Sensor ;
          sosa:observes ?observes ;
          sosa:hasFeatureOfInterest ?location .
  ?observes rdfs:label ?measures .
  ?location geo:lat ?lat ;
           geo:long ?long .
}`;

export const QueryInput = (props) => {
  const [selectedQuery, setSelectedQuery] = createSignal('');
  const [customQuery, setCustomQuery] = createSignal('');
  const [selectAllQuery, setSelectAllQuery] = createSignal(queryAllData)
  const [loading, setLoading] = createSignal(false);

  const executeQuery = () => {
    setLoading(true);
    


    
    // Check if the user entered a custom query; if yes, use it, otherwise, use the selected preset query
    const queryToExecute = customQuery() || `
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    
    SELECT ?sensor ?lat ?long ?measures
    WHERE {
      ?sensor a sosa:Sensor ;
              sosa:observes ?observes ;
              sosa:hasFeatureOfInterest ?location .
      ?observes rdfs:label ?measures .
      ?location geo:lat ?lat ;
               geo:long ?long .
      ${selectedQuery()}
    }`;

    // Trigger the query using props.executeQuery
    props.executeQuery(queryToExecute)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const handleQueryChange = (event) => {
    const selectedQueryValue = event.target.value;
    setSelectedQuery(selectedQueryValue);
  };

  const handleCustomQueryChange = (event) => {
    const customQueryValue = event.target.value;
    setCustomQuery(customQueryValue);
  };

  const handleClear = () => {
    setSelectedQuery('');
    setCustomQuery('');
  };

  const handlePresetQuerySubmit = (event) => {
    event.preventDefault();
    executeQuery();
  };

  return (
    <div>
      <h2>Select sensor type</h2>
      <form onSubmit={handlePresetQuerySubmit}>
        <select onChange={handleQueryChange} value={selectedQuery()}>
          {presetQueries.map((preset, index) => (
            <option key={index} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
        <p>or</p>
        <h2>Enter custom query</h2>
        <textarea
          rows="10"
          cols="60"
          placeholder="Enter your custom SPARQL query here..."
          onChange={handleCustomQueryChange}
          value={customQuery()}
          title="Sample query = PREFIX sosa: <http://www.w3.org/ns/sosa/>
          PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
          
          SELECT ?sensor ?lat ?long ?measures
          WHERE {
            ?sensor a sosa:Sensor ;
                    sosa:observes ?observes ;
                    sosa:hasFeatureOfInterest ?location .
            ?observes rdfs:label ?measures .
            ?location geo:lat ?lat ;
                     geo:long ?long .
            FILTER (?measures = 'video')
          }"
        ></textarea>
        <p></p>
        <button class= "btn" type="submit">Execute Query</button>
        
        <button class="btn btn-primary p-4 ml-4" type="button" onClick={handleClear}> Clear</button>
      </form>
    </div>
  );
};
