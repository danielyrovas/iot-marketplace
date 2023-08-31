import { JsonLdArray } from "jsonld/jsonld-spec";
import { Statement } from "rdflib";
import { mergeProps } from "solid-js";
import { Component, JSXElement } from 'solid-js';
import { render } from 'solid-js/web';

interface RdfDataDisplayProps {
  rdfData: JsonLdArray;
}

export const RdfDataDisplay = (props: RdfDataDisplayProps) => {
    const headers = Object.keys(props.rdfData);
    const merged = mergeProps({rdfData:{head:"vars", results: {bindings: {person: "testing"}}} },props);
    const data = Array.isArray(merged.rdfData) ? merged.rdfData : [merged.rdfData];
    console.log("--------");
    
    console.log(data);
    

    return (
        <div>
            <h2>{JSON.stringify(props.rdfData.results)}</h2>
          <ul>
            <For each= {data}>
                {results => <li>{JSON.stringify(results)}</li>}
            </For>
          </ul>

            
          <h2>RDF Data</h2>
          
          <table>
            <thead><tr>{JSON.stringify(merged.rdfData)}</tr>
            
            </thead>
            
            {/* <tbody>
              {props.rdfData.map((item) => (
                <tr>
                  {headers.map((header) => (
                    <td>{item[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody> */}
          </table>
      <pre>{JSON.stringify(props.rdfData, null, 2)}</pre>
    </div>
  );
};
