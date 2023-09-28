import { createMemo, createSignal } from 'solid-js';
import { QueryInput } from '../logic/QueryInput';
import { RdfDataDisplay } from '../logic/RDFDataDisplay';
import { useAppContext } from '../logic/context';
import { Body, fetch } from '@tauri-apps/api/http';

export default function QuerySensor() {
  const [rdfData, setRdfData] = createSignal(null);
  const [data, setData] = createSignal('');
  const [state, { updateConfig }] = useAppContext();

  const fetchRdfData = async (query2, isPresetQuery) => {
    let query = "SELECT ?sensor ?lat ?long ?measures WHERE { ?sensor <http://www.w3.org/ns/sosa/observes> ?observes. ?sensor <http://www.w3.org/ns/sosa/hasFeatureOfInterest> ?location. ?observes <http://www.w3.org/2000/01/rdf-schema#label> ?measures . ?location <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat .  ?location <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long . ?observes <http://www.w3.org/2000/01/rdf-schema#label> \"video\"}"
    try {
      let response = await fetch(`${state.api}/sparql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: Body.json({ query: query })
      })

      if (!response.ok) {
        console.log(`Query: ${query}`);
        console.log(`HTTP error ${response.status}`);
      }

      // setData(response.data);
      setData(JSON.stringify(response.data))
      // setRdfData(response.data);
    } catch (error) {
      console.error('Error fetching RDF data:', error);
    }
  };

  const memoRdfData = createMemo(() => rdfData());

  return (
    <div>
      <div class="flex flex-col place-items-left m-7">
        <h1>RDF Data Viewer</h1>
        <h2> &nbsp; </h2>
        <QueryInput executeQuery={fetchRdfData} />
        {rdfData() !== null ? (
          <RdfDataDisplay rdfData={memoRdfData()} />
        ) : (
          <div>No query has been executed...</div>
        )}
      </div>
      <div><h1>Data:::</h1><p>{data()}</p></div>
    </div>
  );
}
