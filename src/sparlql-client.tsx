import { createSignal } from 'solid-js';
import * as jsonld from 'jsonld';
import { QueryInput } from './QueryInput';
import { RdfDataDisplay } from './RdfDataDisplay';
import { N3Parser } from 'rdflib';
import * as rdf from 'rdflib';
import { json } from 'stream/consumers';
import { JsonLdArray } from 'jsonld/jsonld-spec';
const sQL = () => {
  const [rdfData, setRdfData] = createSignal<JsonLdArray>([]);


  const fetchRdfData = async (query: string) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const endpointurl = 'https://query.wikidata.org/sparql';
      const headers = { 'Accept': 'application/sparql-results+json' };
      const fullUrl = endpointurl + '?query=' + encodeURIComponent( query );
      const response =  fetch( fullUrl, { headers } ).then( body => body.json() );
  
    //   if (!response.ok) {
    //     throw new Error(`HTTP error ${response.status}`);
    //   }
      
    //   console.log(response);
    //   const abc = response.body;
      
    // fetchRdfData(query ).then(response => {console.log(JSON.stringify(rdfString, null, 2))});

      

      // Convert RDF data to JSON-LD format
    //   const jsonldData = await jsonld.fromRDF(rdfString, { format: 'application/n-quads' });
     const abc = await response.then(body => body);
    //  console.log(Object.keys(abc));
     const efg = Object.keys(abc);
    console.log(efg.length)
      setRdfData(abc);

      
    //   console.log(jsonldData);
    } catch (error) {
      console.error('Error fetching RDF data:', error);
    }
  };

  return (
    <div>
      <h1>RDF Data Viewer</h1>

        <QueryInput executeQuery={fetchRdfData} />
      <RdfDataDisplay rdfData={rdfData()} />
      
    </div>
  );
};

export default sQL;





