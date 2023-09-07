import { createMemo, createSignal } from 'solid-js';
import { RdfDataDisplay } from '../components/rdfdatadisplay';
import { QueryInput } from '../components/queryinput';

const sQL = () => {
  const [rdfData, setRdfData] = createSignal(null);

  const fetchRdfData = async (query) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const endpointurl = 'https://query.wikidata.org/sparql';
      const headers = { 'Accept': 'application/sparql-results+json' };
      const fullUrl = endpointurl + '?query=' + encodeURIComponent(query);
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
      <h1>RDF Data Viewer</h1>
      <h2> &nbsp </h2>
      <QueryInput executeQuery={fetchRdfData} />
      {rdfData() !== null ? (
        <RdfDataDisplay rdfData={memoRdfData()} />
      ) : (
        <div>No query has been executed...</div>
      )}
    </div>
  );
};

export default sQL;
