import { promises } from 'dns';
import { JsonLd, JsonLdArray } from 'jsonld/jsonld-spec';
import { JSX } from 'solid-js';

interface RdfDataDisplayProps {
  rdfData: JsonLdArray; // Change this to the actual type of your RDF data
}

export const RdfDataDisplay = (props: RdfDataDisplayProps): JSX.Element => {
    console.log(props.rdfData)
    const data = Object.keys(props.rdfData);
  if (!props.rdfData) {
    return <div>Loading RDF data...</div>;
  }
 
 console.log(data);
 console.log(props.rdfData);
  if (data.length === 0) {
    return <div>No RDF data to display.</div>;
  }

  // Flatten the rdfData array
  const flattenedData = props.rdfData.flatMap((item) => {
    return Object.values(item);
  });
console.log(flattenedData)
  const headers = Object.keys(flattenedData[0]);

  return (
    <div>
      <h2>RDF Data</h2>
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flattenedData.map((item, rowIndex) => (
            <tr>
              {headers.map((header, columnIndex) => (
                <td>{item[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
