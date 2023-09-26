import { createSignal, createEffect } from "solid-js";
import { QueryInput } from "../logic/QueryInput";

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

  const [selectedQuery, setSelectedQuery] = createSignal(0);
  const [selectedProperty, setSelectedProperty] = createSignal(
    presetQueries[0].value
  );
  const availableQueryOptions = [];
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
    fetchRdfData(queryToExecute)
      .then(() => {
        console.log("fetching data");
      })
      .catch((error) => {
        console.log("error fetching data");
        console.error(error);
      });
  };

  const handlePropertyChange = (event) => {
    const selectedPropertyCode = event.target.value;
    setSelectedProperty(selectedPropertyCode);
    console.log(selectedPropertyCode);
  };
  const datadummy = [
    {
      location: "Melbourne",
      sensortype: "1",
      person: "1",
    },
    {
      location: "Sydney",
      sensortype: "2",
      person: "2",
    },
    {
      location: "Canberra",
      sensortype: "3",
      person: "3",
    },
    {
      location: "Hobart",
      sensortype: "4",
      person: "4",
    },
    {
      location: "Brisbane",
      sensortype: "5",
      person: "5",
    },
    {
      location: "Queensland",
      sensortype: "6",
      person: "6",
    },
    {
      location: "Brisbane",
      sensortype: "2",
      person: "7",
    },
    {
      location: "Perth",
      sensortype: "6",
      person: "8",
    },
    {
      location: "Sydney",
      sensortype: "2",
      person: "9",
    },
    {
      location: "Darwin",
      sensortype: "2",
      person: "3",
    },
  ];
  const [popup, setPopup] = createSignal(false);

  const togglePopup = () => {
    setPopup(!popup());
    console.log(popup());
  };
  const [popup2, setPopup2] = createSignal(false);

  const togglePopup2 = () => {
    setPopup2(!popup2());
    console.log(popup2());
  };

  const [popup3, setPopup3] = createSignal(false);

  const togglePopup3 = () => {
    setPopup3(!popup3());
    console.log(popup3());
  };

  const citylocation = [
    {
      value: "Melbourne",
      label: "Melbourne",
    },
    { value: "Sydney", label: "Sydney" },
    {
      value: "Darwin",
      label: "Darwin",
    },
    {
      value: "Canberra",
      label: "Canberra",
    },
    {
      value: "Perth",
      label: "Perth",
    },
    {
      value: "Brisbane",
      label: "Brisbane",
    },
    {
      value: "Hobart",
      label: "Hobart",
    },
    {
      value: "Cairns",
      label: "Cairns",
    },
  ];

  const sensortype = [
    {
      value: "1",
      label: "Weather Sensors",
    },
    {
      value: "2",
      label: "Camera Sensors",
    },
    {
      value: "3",
      label: "Milk Pressure Sensors",
    },
    {
      value: "4",
      label: "Air Humidity Sensors",
    },
    {
      value: "5",
      label: "Air Temperature Sensors",
    },
    {
      value: "6",
      label: "Milk Temperature Sensors",
    },
  ];

  const [filterlocation, setfilterlocation] = createSignal("");
  const [filtersensor, setfiltersensor] = createSignal("");

  const [rdfData, setRdfData] = createSignal([]);
  const [mapData, setMapData] = createSignal([]);
  const fetchRdfData = async (query) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const endpointUrl = "http://localhost:3000/blazegraph-sparql";
      const headers = { Accept: "application/sparql-results+json" };
      const fullUrl = `${endpointUrl}?query=${encodedQuery}`;
      const response = await fetch(fullUrl, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log(jsonResponse);
      setRdfData(jsonResponse);
    } catch (error) {
      console.error("Error fetching RDF data:", error);
    }
  };
  createEffect(() => {
    // console.log(rdfData())
    // console.log(rdfData().sparql.results[0].result.data);
    // setMapData(rdfData().sparql.results[0].result);
    let forMap = JSON.parse(JSON.stringify(rdfData()));
    console.log(forMap.sparql.results[0].result.data[0]);
    setMapData(forMap.results.bindings);
  });
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
          <div className="grid grid-cols-4 w-full gap-4">
            {rdfData().sparql?.results[0]?.result?.map((result, rowIndex) => (
              <div className="card w-full bg-base-100 shadow-xl" key={rowIndex}>
                <div className="card-body">
                  <h2 className="card-title">Sensor {rowIndex}</h2>
                  {result.binding.map((header, colIndex) => (
                    <td
                      className="w-[140px] overflow-hidden text-ellipsis"
                      key={colIndex}
                    >
                      {header.uri
                        ? Array.isArray(header.uri)
                          ? header.uri[0] || "N/A"
                          : header.uri || "N/A"
                        : Array.isArray(header.literal)
                        ? header.literal[0] || "N/A"
                        : header.literal || "N/A"}
                    </td>
                  ))}
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
                                <td></td>
                                <td>Label</td>
                                <td>Video</td>
                              </tr>
                              {/* row 4 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>Latitude</td>
                                <td>-37.821658</td>
                              </tr>
                              {/* row 5 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>Longitude</td>
                                <td>145.03904</td>
                              </tr>
                              {/* row 6 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>Altitude</td>
                                <td>12.75</td>
                              </tr>
                              {/* row 7 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>Country</td>
                                <td>Australia</td>
                              </tr>
                              {/* row 6 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>Provenance</td>
                                <td>Queensland</td>
                              </tr>
                              {/* row 7 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>City</td>
                                <td>Brisbane</td>
                              </tr>
                              {/* row 8 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>Suburb</td>
                                <td>Stafford</td>
                              </tr>
                              {/* row 9 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>Address</td>
                                <td>9 Webster Street</td>
                              </tr>
                              {/* row 10 */}
                              <tr>
                                <th></th>
                                <td></td>
                                <td>Postcode</td>
                                <td>4053</td>
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
