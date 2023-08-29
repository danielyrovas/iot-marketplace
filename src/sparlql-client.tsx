import { createSignal } from 'solid-js';
import * as jsonld from 'jsonld';
import { QueryInput } from './QueryInput';
import { RdfDataDisplay } from './RdfDataDisplay';

const sQL = () => {
  const [rdfData, setRdfData] = createSignal<any[]>([]);

  const fetchRdfData = async (query: string) => {
    try {
      const response = await fetch('https://query.wikidata.org/sparql', {
        method: 'POST',
        headers: {'Accept': 'application/sparql-results+json'
          
        },
        body: query,
      });

      const rdfString = await response.text();

      const jsonldData = await jsonld.fromRDF(rdfString, { format: 'application/n-quads' });

      setRdfData(jsonldData);
    } catch (error) {
      console.error('Error fetching RDF data:', error);
    }
  };

  return (
    <div>
      <h1>RDF Data Viewer</h1>
      <RdfDataDisplay rdfData={rdfData()} />
      <QueryInput executeQuery={fetchRdfData} />
    </div>
  );
};

export default sQL;





