// querysensor.jsx
import { createMemo, createSignal } from 'solid-js';
import { QueryInput } from '../logic/QueryInput';
import { RdfDataDisplay } from '../logic/RDFDataDisplay';

export default function QuerySensor() {
  const [rdfData, setRdfData] = createSignal(null);

  const fetchRdfData = async (query, isPresetQuery) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const endpointUrl = 'http://localhost:3000/blazegraph-sparql';
      const headers = { 'Accept': 'application/sparql-results+json' };
      const fullUrl = `${endpointUrl}?query=${encodedQuery}`;
      const response = await fetch(fullUrl, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const jsonResponse = await response.json();
      setRdfData(jsonResponse);
    } catch (error) {
      console.error('Error fetching RDF data:', error);
    }
  };

  const memoRdfData = createMemo(() => rdfData());

  return (
    <div>
        <div class="flex flex-col place-items-center m-4">
      <h1>RDF Data Viewer</h1>
      <h2> &nbsp; </h2>
      <QueryInput executeQuery={fetchRdfData} />
      {rdfData() !== null ? (
        <RdfDataDisplay rdfData={memoRdfData()} />
      ) : (
        <div>No query has been executed...</div>
      )}
      </div>
    </div>
  );
}
