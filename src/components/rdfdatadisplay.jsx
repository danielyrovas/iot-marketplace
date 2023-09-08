import { createStore } from 'solid-js/store';

export const RdfDataDisplay = (props) => {
  if (props.rdfData === null|| props.rdfData === undefined) {
    return <div>No data available...</div>;
  }

  const results = props.rdfData?.results?.bindings;
  if (!results || results.length === 0) {
    return <div>No RDF data to display.</div>;
  }

  console.log(props.rdfData);
  const [ts, setTs] = createStore();
  setTs(props.rdfData);

  return (
    <div>
      {console.log(props.rdfData?.results?.bindings[0])}
      <h2> &nbsp; </h2>
      {/* <h2>RAW DATA RETURN</h2> */}
      {/* <h2>{JSON.stringify(props.rdfData)}</h2> */}
      <h2> &nbsp; </h2>
      <h2>RDF Data</h2>
      <table>
        <thead>
          <tr>
            {Object.keys(props.rdfData?.results?.bindings[0]||{'no data available':'value'}).map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rdfData?.results?.bindings.map((binding, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(props.rdfData?.results?.bindings[0]||{'no data available':'value'}).map((header) => (
                <td key={header}>
                  {binding[header]?.value ?? 'N/A'} &nbsp; &nbsp; 
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
