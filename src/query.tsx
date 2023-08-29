import { createSignal } from "solid-js";
import { QueryEngine } from "../commuica/comunica/engines/query-sparql-rdfjs/lib";
import { QueryEngineFactory } from "../commuica/comunica/engines/query-sparql/lib";
import { Namespace, NamedNode, literal } from 'rdflib';
import auth from 'solid-auth-client';


export default function Home() {

  const SOSA = Namespace('http://www.w3.org/ns/sosa/');
  const RDF = Namespace('http://www.w3.org/2000/01/rdf-schema#');
  const GEO = Namespace('http://www.w3.org/2003/01/geo/wgs84_pos#');
  
  const queryEngine =  QueryEngineFactory;
  const data = [
    {
      image:"https://picsum.photos/id/42/200/200", 
      title:"Sensor 1",
    },
    {
      image:"https://picsum.photos/id/43/200/200", 
      title:"Sensor 2",
    },
    {
      image:"https://picsum.photos/id/44/200/200", 
      title:"Sensor 3",
    }
  ]
const [queryResult, setQueryResult] = createSignal(null);

  async function executeSPARQLQuery() {
    const query = `
      SELECT ?sensor ?lat ?long ?measures
      WHERE {
        ?sensor sosa:observes ?observes.
        ?sensor sosa:hasFeatureOfInterest ?location.
        ?observes rdf:label ?measures.
        ?location geo:lat ?lat.
        ?location geo:long ?long.
        ?observes rdf:label "video".
      }
    `;

    try {
      const result = await queryEngine.query(query);
      setQueryResult(result);
    } catch (error) {
      console.error('Error executing SPARQL query:', error);
    }
  }


  return (
    <div className="mx-auto p-8 w-full max-w-[1200px] flex flex-col gap-8">
    <div className="flex flex-row gap-4">
        <button>Get All Camera Sensors</button>
        <button>Get All Milk Pressure Sensors</button>
        <button>Get All Air Temperature Sensors</button>
        <button>Get All Air Humidity Sensors</button>
        <button>Get All Milk Temperature Sensors</button>
        <button>Get All Sensors in Australia</button>
    </div>       
     <div className="grid grid-cols-4 gap-4">
      {data.map((data,index) => (
                    <div className="bg-white p-4 rounded-lg flex flex-col gap-4" key={index}>
                    <img src={data.image} />
                    <p>{data.title}</p>
                </div>
      ))}

        </div>
    <div className="sen"></div>
    <div>
      <button onClick={executeSPARQLQuery}>Execute Query</button>
      <div>
        {queryResult() && (
          <ul>
            {queryResult().bindings.map((binding, index) => (
              <li key={index}>
                <strong>Sensor:</strong> {binding.sensor.value}<br />
                <strong>Latitude:</strong> {binding.lat.value}<br />
                <strong>Longitude:</strong> {binding.long.value}<br />
                <strong>Measures:</strong> {binding.measures.value}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
</div>

  );
}
