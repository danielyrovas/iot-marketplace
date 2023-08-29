interface RdfDataDisplayProps {
  rdfData: any[];
}

export const RdfDataDisplay = (props: RdfDataDisplayProps) => {
  return (
    <div>
      <h2>RDF Data</h2>
      <pre>{JSON.stringify(props.rdfData, null, 2)}</pre>
    </div>
  );
};
