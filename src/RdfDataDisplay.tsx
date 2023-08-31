import { createSignal, Component, JSX } from 'solid-js';
import { JsonLdArray } from 'jsonld/jsonld-spec';
import { createStore } from 'solid-js/store';


interface RdfDataDisplayProps {
  rdfData: JsonLdArray | null;
}

export const RdfDataDisplay: Component<RdfDataDisplayProps> = (props) => {
  if (props.rdfData === null) {
    return <div>Loading RDF data...</div>;
  }
  console.log(props.rdfData)
  const results = props.rdfData?.results?.bindings;
  if (!results || results.length === 0) {
    return <div>No RDF data to display.</div>;
  }
  console.log(results);
 const [ts, setTs] = createStore()
  const headers = Object.keys(results[0]);

  console.log(headers);
  setTs(props.rdfData);
 

  return (
    <div >
        

        {console.log(props.rdfData?.results?.bindings[0])}
        <h2> &nbsp </h2>
        <h2>RAW DATA RETURN</h2>
        <h2>{JSON.stringify(props.rdfData)}</h2>
        <h2> &nbsp </h2>
      <h2>RDF Data</h2>
      <table>
        <thead>
          <tr>
            {Object.keys(props.rdfData?.results?.bindings[0]).map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(props.rdfData?.results?.bindings).map((binding, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(props.rdfData?.results?.bindings[0]).map((header) => (
                <td key={header}>{binding[header]?.value} &nbsp &nbsp </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
