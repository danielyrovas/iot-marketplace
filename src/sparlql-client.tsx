import { createSignal } from 'solid-js';
import * as jsonld from 'jsonld';
import { QueryInput } from './QueryInput';
import { RdfDataDisplay } from './RdfDataDisplay';
import { N3Parser } from 'rdflib';
import * as rdf from 'rdflib';
import { json } from 'stream/consumers';
const sQL = () => {
  const [rdfData, setRdfData] = createSignal<any[]>([]);


  const fetchRdfData = async (query: string) => {
    try {
        console.log(query);
      const encodedQuery = encodeURIComponent(query);
      const endpointurl = 'https://query.wikidata.org/sparql';
      const headers = { 'Accept': 'application/sparql-results+json' };
      const fullUrl = endpointurl + '?query=' + encodeURIComponent( query );
      const response =  fetch( fullUrl, { headers } ).then( body => body.json() );
  
    //   if (!response.ok) {
    //     throw new Error(`HTTP error ${response.status}`);
    //   }
      const rdfString =  response;
      console.log(rdfString);
    //   const abc = response.body;
      
    // fetchRdfData(query ).then(response => {console.log(JSON.stringify(rdfString, null, 2))});

      

      // Convert RDF data to JSON-LD format
    //   const jsonldData = await jsonld.fromRDF(rdfString, { format: 'application/n-quads' });

      setRdfData(await rdfString);
    //   console.log(jsonldData);
    } catch (error) {
      console.error('Error fetching RDF data:', error);
    }
  };

  return (
    <div>
      <h1>RDF Data Viewer</h1>
        <p></p>
      <RdfDataDisplay rdfData={rdfData()} />
      <QueryInput executeQuery={fetchRdfData} />
    </div>
  );
};

export default sQL;





