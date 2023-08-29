import { createSignal } from 'solid-js';
import { Namespace, sym, QueryEngine, IndexedFormula } from 'rdflib';

const FOAF = Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = Namespace('http://www.w3.org/2006/vcard/ns#');

function SPARQLQueryComponent() {
  const [queryResult, setQueryResult] = createSignal<Record<string, string>[]>([]);

  async function executeSPARQLQuery() {
    const query = `
      SELECT ?sensor ?lat ?long ?measures
      WHERE {
        ?sensor <http://www.w3.org/ns/sosa/observes> ?observes.
        ?sensor <http://www.w3.org/ns/sosa/hasFeatureOfInterest> ?location.
        ?observes <http://www.w3.org/2000/01/rdf-schema#label> ?measures.
        ?location <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat.
        ?location <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long.
        ?observes <http://www.w3.org/2000/01/rdf-schema#label> "video".
      }
    `;

    const store = new IndexedFormula(); // Create a new store

    // Load RDF data into the store (replace with your data)
    store.add(
      sym('http://example.com/sensor1'),
      FOAF('name'),
      'Sensor 1'
    );
    // ... Add more data to the store

    const queryEngine = new QueryEngine(store);

    try {
      const results = await queryEngine.query(query);
      setQueryResult(results.map(binding => binding as Record<string, string>));
    } catch (error) {
      console.error('Error executing SPARQL query:', error);
    }
  }

  return (
    <div>
      <button onClick={executeSPARQLQuery}>Execute Query</button>
      <div>
        {queryResult().length > 0 && (
          <ul>
            {queryResult().map((binding, index) => (
              <li key={index}>
                <strong>Sensor:</strong> {binding.sensor}<br />
                <strong>Latitude:</strong> {binding.lat}<br />
                <strong>Longitude:</strong> {binding.long}<br />
                <strong>Measures:</strong> {binding.measures}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SPARQLQueryComponent;
