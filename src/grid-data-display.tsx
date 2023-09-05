import { createEffect } from 'solid-js';

interface RdfDataDisplayProps {
    rdfData: any[];
  }
  
  export const GridRdfDataDisplay = (props: RdfDataDisplayProps) => {
    console.log(props.rdfData)
    const dataString = JSON.stringify(props.rdfData, null, 2)
    const dataObject = JSON.parse(dataString)
    let parsedData;
try {
  parsedData = JSON.parse(props.rdfData);
} catch (error) {
  console.error(error);
  // handle error here, for example by displaying an error message
}
    createEffect(()=> {console.log(dataObject)})
    return (
        <>
         <div>
        <h2>RDF Data</h2>
        {/* <pre>{JSON.parse(props.rdfData, null, 2)}</pre> */}
        <pre>{parsedData}</pre>
      </div>
         {/* {props.rdfData(props.rdfData, null, 2).map((data) => (
                <>
                  <div className="flex flex-col gap-4 border rounded p-4">
                    <span>{data.location}</span>
                    <span>{data.sensortype}</span>
                  </div>
                </>
              ))
            } */}
        </> 
    );
  };
  