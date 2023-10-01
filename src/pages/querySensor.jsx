import { createMemo, createSignal } from 'solid-js';
import { QueryInput } from '../logic/QueryInput';
import { RdfDataDisplay } from '../logic/RDFDataDisplay';
import { useAppContext } from '../logic/context';
import { Body, fetch } from '@tauri-apps/api/http';
export default function QuerySensor() {
  const [rdfData, setRdfData] = createSignal(null);
  const [data, setData] = createSignal('');
  const [state, { updateConfig }] = useAppContext();
  const freeformEscaper = document.createElement('textarea');
  const freeformEscape = (html) => {
        freeformEscaper.textContent = html;
        return freeformEscaper.innerHTML;
      }
  const fetchRdfData = async (query, isPresetQuery) => {

  try {
    // Encode the query as a URL parameter
    const encodedQuery = encodeURIComponent(query);
    
    // Send a GET request with the query as a URL parameter
    let response = await fetch(`${state.api}/sparql/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: Body.json({ query: query })
    })
    setRdfData(response.data.values)

    if (!response.ok) {
      console.log(`Query: ${query}`);
      console.log(`HTTP error ${response.status}`)}    
    } catch (error) {
      console.error(`Error: ${error}`);
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
    </div>
  );
}