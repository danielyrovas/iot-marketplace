import { createSignal } from 'solid-js';
import Button from '../components/Button';
import Heading from '../components/heading';

const presetQueries = [
  {
    label: 'All Sensor',
    property: 'observes',
    value: '',
  },
  {
    label: 'All sensor in Australia',
    property: 'observes',
    value: '?location juso:country "Australia"',
  },
  {
    label: 'Camera Sensors',
    property: 'observes',
    value: '?observes rdfs:label "video"',
  },
  {
    label: 'Milk temperature',
    property: 'observes',
    value: '?observes rdfs:label "Milk Temperature"',
  },
  {
    label: 'Milk Pressure',
    property: 'observes',
    value: '?observes rdfs:label "milk pressure"',
  },
  {
    label: 'Relative air Humidity',
    property: 'observes',
    value: '?observes rdfs:label "relative air Humidity"',
  },


];


export const QueryInput = (props) => {
  const [selectedQuery, setSelectedQuery] = createSignal('');
  const [customQuery, setCustomQuery] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const executeQuery = () => {
    setLoading(true);
    


    
    // Check if the user entered a custom query; if yes, use it, otherwise, use the selected preset query
    const queryToExecute = customQuery() || `
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX juso: <http://rdfs.co/juso/>
    
    SELECT ?sensor ?lat ?long ?measures ?country ?City ?Provenance ?Suburb ?Address ?Postcode
    WHERE {
      ?sensor sosa:observes ?observes.
      ?sensor sosa:hasFeatureOfInterest ?location.
      ?observes rdfs:label ?measures.
      ?location geo:lat ?lat.
      ?location geo:long ?long.
      ?location juso:country ?country.
      ?location juso:City ?City.
      ?location juso:Provenance ?Provenance.
      ?location juso:Suburb ?Suburb.
      ?location juso:Address ?Address.
      ?location juso:Postcode ?Postcode.
      ${selectedQuery()}
    }`;

    // Trigger the query using props.executeQuery
    props.executeQuery(queryToExecute)
      // .then(() => {
      //   setLoading(false);
      // })
      // .catch((error) => {
      //   setLoading(false);
      //   console.error(error);
      // });
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
    setSelectedQuery(null);
    setCustomQuery('');
  };

  const handlePresetQuerySubmit = (event) => {
    event.preventDefault();
    executeQuery();
  };

  return (
    <div>
      <Heading text="SPARQL Sensor Query"/>
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
          title="Sample query = SELECT ?sensor ?lat ?long ?measures ?country ?City ?Provenance ?Suburb ?Address ?Postcode
          WHERE { ?sensor <http://www.w3.org/ns/sosa/observes> ?observes. 
          ?sensor <http://www.w3.org/ns/sosa/hasFeatureOfInterest> ?location. 
          ?observes <http://www.w3.org/2000/01/rdf-schema#label> ?measures . 
          ?location <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat . 
          ?location <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long . 
          ?location <http://rdfs.co/juso/country> ?country . 
          ?location <http://rdfs.co/juso/City> ?City . 
          ?location <http://rdfs.co/juso/Provenance> ?Provenance . 
          ?location <http://rdfs.co/juso/Suburb> ?Suburb . 
          ?location <http://rdfs.co/juso/Address> ?Address . 
          ?location <http://rdfs.co/juso/Postcode> ?Postcode . 
          ?observes <http://www.w3.org/2000/01/rdf-schema#label> 'video'}"
        ></textarea>
        <div className="flex gap-4">
        <Button text="Execute Query" type="submit"/>
        <Button text="Clear" type="button" onClick={handleClear}/>
        </div>
      </form>
    </div>
  );
};
