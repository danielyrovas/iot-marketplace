import { render, fireEvent, screen } from "@solidjs/testing-library";
const { QueryInput } = require("./QueryInput");

test("if form is submitted, handlePresetQuerySubmit is called", async () => {
  const handlePresetQuerySubmit = jest.fn();
  const { container } = render(() => <QueryInput executeQuery={handlePresetQuerySubmit} />);
  const selectElement = screen.getByRole("combobox");
  const presetQueryValue = "";

  // Use await to ensure the change event completes before proceeding
  await fireEvent.change(selectElement, { target: { value: presetQueryValue } });

  const expectedQuery = `
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX juso: <http://rdfs.co/juso/>
    
    SELECT ?sensor ?lat ?long ?measures ?country ?City ?Provenance ?Suburb ?Address ?Postcode
    WHERE {
      ?sensor sosa:observes ?observes.
      ?sensor sosa:hasFeatureOfInterest ?location.
      ?observes rdfs:label ?measures.
      ?location geo:lat ?lat.
      ?location geo:long ?long.
      ?location juso:country ?country.
      ?location juso:City ?City.
      ?location juso:Provenance ?Provenance.
      ?location juso:Suburb ?Suburb.
      ?location juso:Address ?Address.
      ?location juso:Postcode ?Postcode.
      ${presetQueryValue}
    }`;

  // Use await to ensure the submit event completes before proceeding
  await fireEvent.submit(container.querySelector("form"));

  expect(handlePresetQuerySubmit).toHaveBeenCalledWith(expectedQuery);
});