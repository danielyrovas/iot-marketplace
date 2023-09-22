import { createSignal, createEffect } from "solid-js";
import { QueryInput } from "../logic/QueryInput";

export default function QuerySensor() {
  const presetQueries = [
    {
      label: "Person",
      property: "P31",
      value: "Q5",
    },
    {
      label: "City",
      property: "P31",
      value: "Q515",
    },
    {
      label: "Country",
      property: "P31",
      value: "Q6256",
    },
  ];

  const [selectedQuery, setSelectedQuery] = createSignal(0);
  const [selectedProperty, setSelectedProperty] = createSignal(
    presetQueries[0].value
  );
  const availableQueryOptions = [];
  const handlePresetQuerySubmit = (event) => {
    event.preventDefault();
    const selectedPresetQuery = `SELECT ?item ?itemLabel WHERE {
  ?item wdt:P31 wd:${selectedProperty()};
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} LIMIT 10`;
    fetchRdfData(selectedPresetQuery);
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
      const endpointurl = "https://query.wikidata.org/sparql";
      const headers = { Accept: "application/sparql-results+json" };
      const fullUrl = endpointurl + "?query=" + encodeURIComponent(query);
      const response = await fetch(fullUrl, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const jsonResponse = await response.json();
      setRdfData(jsonResponse);
    } catch (error) {
      console.error("Error fetching RDF data:", error);
    }
  };
  createEffect(() => {
    let forMap = JSON.parse(JSON.stringify(rdfData()));
    console.log(forMap.results.bindings);
    setMapData(forMap.results.bindings);
  });
  return (
    <>
      <div className="mx-auto w-full max-w-[1200px] flex flex-row gap-4 min-h-screen">
        <div className="w-[300px] p-4 flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={handlePresetQuerySubmit}>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">SPARQL Query</span>
              </label>
              <select
                className="select select-bordered"
                onChange={handlePropertyChange}
              >
                <option disabled selected>
                  Pick one
                </option>
                {presetQueries.map((data) => (
                  <option value={data.value}>{data.label}</option>
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
            {mapData() !== null
              ? mapData().map((data, index) => {
                  if (data.personLabel) {
                    return (
                      <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title">
                            {data.personLabel.value}
                          </h2>
                          <p>
                            If a dog chews shoes whose shoes does he choose?
                          </p>
                          <div className="card-actions justify-start">
                            <button className="btn btn-primary">Details</button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (data.cityLabel) {
                    return (
                      <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title">{data.cityLabel.value}</h2>
                          <p>
                            If a dog chews shoes whose shoes does he choose?
                          </p>
                          <div className="card-actions justify-start">
                            <button className="btn btn-primary">Details</button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (data.countryLabel) {
                    return (
                      <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title">
                            {data.countryLabel.value}
                          </h2>
                          <p>
                            If a dog chews shoes whose shoes does he choose?
                          </p>
                          <div className="card-actions justify-start">
                            <button className="btn btn-primary">Details</button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (data.itemLabel) {
                    return (
                      <div className="card w-full bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title">{data.itemLabel.value}</h2>
                          <p>
                            If a dog chews shoes whose shoes does he choose?
                          </p>
                          <div className="card-actions justify-start">
                            {/* You can open the modal using document.getElementById('ID').showModal() method */}
                            <button
                              className="btn"
                              onClick={() =>
                                document
                                  .getElementById(`modal-${index}`)
                                  .showModal()
                              }
                            >
                              Details
                            </button>
                            <dialog id={`modal-${index}`} className="modal">
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
                                      <tr>
                                        <th></th>
                                        <th>Subject</th>
                                        <th>Predicate</th>
                                        <th>Object</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* row 1 */}
                                      <tr>
                                        <th></th>
                                        <td></td>
                                        <td>Observes</td>
                                        <td>SensorVideo</td>
                                      </tr>
                                      {/* row 2 */}
                                      <tr>
                                        <th></th>
                                        <td></td>
                                        <td>FeatureOfInterest</td>
                                        <td>CameraSensorLocation</td>
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
                    );
                  }
                })
              : "No Data"}
            {/* {JSON.stringify(rdfData().results, null, 2)} */}
            {/* <GridRdfDataDisplay rdfData={rdfData()}/> */}
            {/* {rdfData() && rdfData().map((data) => (
                <>
                  <div className="flex flex-col gap-4 border rounded p-4">
                    <span>{data.location}</span>
                    <span>{data.sensortype}</span>
                  </div>
                </>
              ))
            } */}
            {/* {!filterlocation
              ? datadummy.map((data) => (
                  <>
                    <div className="flex flex-col gap-4 border rounded p-4">
                      <span>{data.location}</span>
                      <span>{data.sensortype}</span>
                    </div>
                  </>
                ))
              : datadummy
                  .filter((data) => data.location === filterlocation())
                  .filter((data) => data.sensortype === filtersensor())
                  .map((data) => (
                    <>
                      <div className="flex flex-col gap-4 border rounded p-4">
                        <span>{data.location}</span>
                        <span>{data.sensortype}</span>
                      </div>
                    </>
                  ))} */}
          </div>
        </div>
      </div>
      {popup() && (
        <div
          className={`flex items-center justify-center fixed inset-0 backdrop-blur`}
        >
          <div className="flex flex-col gap-4 w-full max-w-sm border rounded p-4 bg-white">
            <div className="flex justify-between">
              <div>Location</div>
              <button onClick={togglePopup}>Close</button>
            </div>
            <div className="flex flex-col gap-4">
              <select className="p-2 border" name="" id="">
                <option value="Australia">Australia</option>
              </select>
              {/* <select className="p-2 border" name="" id="">
                <option value="State">State</option>
              </select> */}
              <select
                className="p-2 border"
                name=""
                id=""
                onChange={(data) => {
                  setfilterlocation(data.target.value);
                  console.log(filterlocation());
                }}
              >
                {citylocation.map((data) => (
                  <option key={data.value} value={data.value}>
                    {data.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      {popup2() && (
        <div
          className={`flex items-center justify-center fixed inset-0 backdrop-blur`}
        >
          <div className="flex flex-col gap-4 w-full max-w-sm border rounded p-4 bg-white">
            <div className="flex justify-between">
              <div>Sensor Type</div>
              <button onClick={togglePopup2}>Close</button>
            </div>
            <div className="flex flex-col gap-4">
              <select
                className="p-2 border"
                name=""
                id=""
                onChange={(data) => {
                  setfiltersensor(data.target.value);
                  console.log(filtersensor());
                }}
              >
                {sensortype.map((data) => (
                  <option key={data.value} value={data.value}>
                    {data.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      {popup3() && (
        <div
          className={`flex items-center justify-center fixed inset-0 backdrop-blur`}
        >
          <div className="flex flex-col gap-4 w-full max-w-sm border rounded p-4 bg-white">
            <div className="flex justify-between">
              <div>Execute Query</div>
              <button onClick={togglePopup3}>Close</button>
            </div>
            <div className="flex flex-col gap-4"></div>
          </div>
        </div>
      )}
      <div></div>
    </>
  );
}
