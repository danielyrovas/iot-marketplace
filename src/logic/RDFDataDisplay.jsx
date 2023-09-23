//rdfdatadisplay.jsx

export const RdfDataDisplay = (props) => {
    if (!props.rdfData || !props.length ==='undefined' || !props.rdfData.sparql.results) {
      return <div>No RDF data available...</div>;
    }
    console.log(props.rdfData)
    console.log(props)
    console.log(props.rdfData)
    const results = props?.rdfData?.sparql?.results[0].result;
    const head = props.rdfData.sparql.head;
  
    // if (!props.rdfData || !props.rdfData.sparql.results[0].result || props.rdfData.sparql.results[0].result.length === 0) {
    //   return <div>No RDF data to display.</div>;
    // }
  
    // Extract the headers using the nested structure
    const test = props?.rdfData?.sparql?.results[0]
    // const headers = test?.binding?.map((binding) => binding.$.name);
    console.log(results)

    // console.log(headers)
  
    return (
      <div >
        
        <table>
          <thead>
            <tr>
              {/* {props?.rdfData?.sparql?.results[0].result[0].binding[0].$.name?.map((header) =>(
                <th key={header}>{header}</th>
                
              ))
              
              } */}
              {/* {props?.rdfData?.sparql?.results[0]?.result?.binding?.map((binding) => (
              <th key = {binding}>{binding.$.name}</th>
              || ' Data not available'
             ))} */}
            </tr>


            <tr>
                {props?.rdfData?.sparql?.results[0]?.result?.[0]?.binding?.map((binding, colIndex) => (
                    <th key={binding}>{binding.$.name}</th>
                )) || <th>Data not available</th>}
            </tr>
          </thead>


          
          <tbody>
            {props?.rdfData?.sparql?.results[0]?.result?.map((result, rowIndex) => (
                
              <tr key={rowIndex}>
                {console.log(result)}
                {result.binding.map((header, colIndex) => (
                  <td key={colIndex}>
                    {header.uri ? (
                      Array.isArray(header.uri)
                        ? header.uri[0] || 'N/A'
                        : header.uri || 'N/A'
                    ) : (
                      Array.isArray(header.literal)
                        ? header.literal[0] || 'N/A'
                        : header.literal || 'N/A'
                    )}
                  </td>
                ))}
              </tr> || ' Data not available'
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  