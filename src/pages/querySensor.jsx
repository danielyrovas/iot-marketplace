import { createSignal, createEffect } from "solid-js";
import { QueryInput } from "../logic/QueryInput";
import { useAppContext } from '../logic/context';
import { Body, fetch } from '@tauri-apps/api/http';

export default function QuerySensor() {
  const presetQueries = [
    {
      label: "All Sensor",
      property: "observes",
      value: "",
    },
    {
      label: "Camera Sensors",
      property: "observes",
      value: 'FILTER (?measures = "video")',
    },
    {
      label: "Milk temperature",
      property: "observes",
      value: 'FILTER (?measures = "Milk Temperature")',
    },
    {
      label: "Milk Pressure",
      property: "observes",
      value: 'FILTER (?measures = "milk pressure")',
    },
    {
      label: "Relative air Humidity",
      property: "observes",
      value: 'FILTER (?measures = "relative air Humidity")',
    },
  ];
  const [selectedProperty, setSelectedProperty] = createSignal(
    presetQueries[0].value
  );
  const handlePresetQuerySubmit = (event) => {
    event.preventDefault();
    executeQuery();
  };
  const executeQuery = () => {
    // Check if the user entered a custom query; if yes, use it, otherwise, use the selected preset query
    const queryToExecute = `
    PREFIX sosa: <http://www.w3.org/ns/sosa/>
    PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    
    SELECT ?sensor ?lat ?long ?measures
    WHERE {
      ?sensor a sosa:Sensor ;
              sosa:observes ?observes ;
              sosa:hasFeatureOfInterest ?location .
      ?observes rdfs:label ?measures .
      ?location geo:lat ?lat ;
               geo:long ?long .
      ${selectedProperty()}
    }`;

    // Trigger the query using props.executeQuery
    fetchRdfData()
      // .then(() => {
      //   console.log("fetching data");
      // })
      // .catch((error) => {
      //   console.log("error fetching data");
      //   console.error(error);
      // });
  };
  const handlePropertyChange = (event) => {
    const selectedPropertyCode = event.target.value;
    setSelectedProperty(selectedPropertyCode);
    console.log(selectedPropertyCode);
  };
  const [rdfData, setRdfData] = createSignal([]);
  const [mapData, setMapData] = createSignal([]);
  const [state, { updateConfig }] = useAppContext();
  // const fetchRdfData = async () => {
  //   let query = "SELECT ?sensor ?lat ?long ?measures WHERE { ?sensor <http://www.w3.org/ns/sosa/observes> ?observes. ?sensor <http://www.w3.org/ns/sosa/hasFeatureOfInterest> ?location. ?observes <http://www.w3.org/2000/01/rdf-schema#label> ?measures . ?location <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat .  ?location <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long . ?observes <http://www.w3.org/2000/01/rdf-schema#label> \"video\"}"

  //   try {
  //     let response = await fetch(`${state.api}/sparql`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: Body.json({ query: query })
  //     })

  //     if (!response.ok) {
  //       throw new Error(`HTTP error ${response.status}`);
  //     }

  //     // const jsonResponse = await response.json();
  //     console.log(response);
  //     setRdfData(response);
  //   } catch (error) {
  //     console.error("Error fetching RDF data:", error);
  //   }
  // };
  const fetchRdfData = async (query2, isPresetQuery) => {
    let query = "SELECT ?sensor ?lat ?long ?measures WHERE { ?sensor <http://www.w3.org/ns/sosa/observes> ?observes. ?sensor <http://www.w3.org/ns/sosa/hasFeatureOfInterest> ?location. ?observes <http://www.w3.org/2000/01/rdf-schema#label> ?measures . ?location <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat .  ?location <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long . ?observes <http://www.w3.org/2000/01/rdf-schema#label> \"video\"}"
    try {
      let response = await fetch(`${state.api}/sparql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: Body.json({ query: query })
      })

      if (!response.ok) {
        console.log(`Query: ${query}`);
        console.log(`HTTP error ${response.status}`);
      }

      // setData(response.data);
      console.log(response.data.values[0].lat.value)
      console.log(response.data.values[0].long.value)
      console.log(response.data.values[0].measures.value)
      console.log(response.data.values[0].sensor.value)
      setRdfData(response.data.values)
      // setRdfData(response.data);
    } catch (error) {
      console.error('Error fetching RDF data:', error);
    }
  };

  // createEffect(() => {
  //   let forMap = JSON.parse(rdfData());
  //   console.log(forMap)
    // console.log(forMap.sparql.results[0].result.data[0]);
    // setMapData(forMap.results.bindings);
  // });
  return (
    <>
      <div className="mx-auto w-full max-w-[1200px] flex flex-row gap-4 min-h-screen">
        <div className="w-[300px] p-4 flex flex-col gap-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={handlePresetQuerySubmit}
          >
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">SPARQL Query</span>
              </label>
              <select
                className="select select-bordered"
                onChange={handlePropertyChange}
                value={selectedProperty()}
              >
                <option disabled selected>
                  Pick one
                </option>
                {presetQueries.map((preset, index) => (
                  <option key={index} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Custom Query</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                disabled
              />
            </div>
            <button className="btn">Execute Query</button>
          </form>
          {/* <button className="border rounded px-4 py-2" onClick={togglePopup}>
            Location
          </button>
          <button className="border rounded px-4 py-2" onClick={togglePopup2}>
            Sensor Type
          </button>
          <button className="border rounded px-4 py-2" onClick={togglePopup3}>
            Execute Query
          </button> */}
        </div>
        <div className="grow p-4">
          <div className="grid grid-cols-3 w-full gap-4">
            {rdfData().map((data, index) => (
              <div className="card w-full bg-base-100 shadow-xl" key={index}>
                <div className="card-body">
                  <h2 className="card-title">{data.sensor.value}</h2>
                  <p>{data.lat.value}</p>
                  <p>{data.long.value}</p>
                  <p>{data.measures.value}</p>
                  <div className="card-actions justify-start">
                    {/* You can open the modal using document.getElementById('ID').showModal() method */}
                    <button
                      className="btn"
                      onClick={() =>
                        document.getElementById(`modal`).showModal()
                      }
                    >
                      Details
                    </button>
                    <dialog id={`modal`} className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <h3 className="font-bold text-lg">Details</h3>
                        <div className="overflow-x-auto">
                          <table className="table">
                            {/* head */}
                            <thead>
                              {/* <tr>
                                    <th></th>
                                    <th>Subject</th>
                                    <th>Predicate</th>
                                    <th>Object</th>
                                  </tr> */}
                            </thead>
                            <tbody>
                              {/* row 1 */}
                              <tr>
                                <th></th>

                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://</li>
                                    <li>http://www.w3.org/ns/sosa/observes</li>
                                    <li>SSMS://#CameraSensorVideo</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 2 */}
                              <tr>
                                <th></th>

                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://</li>
                                    <li>
                                      http://www.w3.org/ns/sosa/hasFeatureOfInterest
                                    </li>
                                    <li>SSMS://#CameraSensorLocation</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 3 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorVideo</li>
                                    <li>http://www.w3.org/2000/01/rdf-schema#label</li>
                                    <li>Video</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 4 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://www.w3.org/2003/01/geo/wgs84_pos#lat</li>
                                    <li>-37.821568</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 5 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://www.w3.org/2003/01/geo/wgs84_pos#long</li>
                                    <li>145.03904</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 6 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://www.w3.org/2003/01/geo/wgs84_pos#alt</li>
                                    <li>12.75</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 7 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://rdfs.co/juso/country</li>
                                    <li>Australia</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 6 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://rdfs.co/juso/provenance</li>
                                    <li>Queensland</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 7 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://rdfs.co/juso/city</li>
                                    <li>Brisbane</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 8 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://rdfs.co/juso/suburb</li>
                                    <li>Stafford</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 9 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://rdfs.co/juso/address</li>
                                    <li>9 Webster Street</li>
                                  </ul>
                                </td>
                              </tr>
                              {/* row 10 */}
                              <tr>
                                <th></th>
                                <td>
                                  <ul>
                                    <li>Subject</li>
                                    <li>Predicate</li>
                                    <li>Object</li>
                                  </ul>
                                </td>
                                <td>
                                  <ul>
                                    <li>SSMS://#CameraSensorLocation</li>
                                    <li>http://rdfs.co/juso/postcode</li>
                                    <li>4053</li>
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}