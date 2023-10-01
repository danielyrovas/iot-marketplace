export const RdfDataDisplay = (props) => {
  // if ( !props.rdfData) {
  //   return <div>No RDF data available...</div>;
  // }
  console.log(props.rdfData)



  return (
    <div >
      

      <div className="grow p-4">
        <div className="grid grid-cols-3 w-full gap-4">
        {props?.rdfData?.length === 0 ? ( <div >No data available for the sensor type you chosen or custom query you entered </div>):(<div></div>)}
          {props?.rdfData?.map((data, index) => (
            <div className="card w-full bg-base-100 shadow-xl" key={index}>
              <div className="card-body">
                <h2 className="card-title">{data.sensor.value}</h2>
                <p>Latitude: {data.lat.value}</p>
                <p>Longitude: {data.long.value}</p>
                <p>Sensory Type: {data.measures.value}</p>
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
                                  <li>{data.measures.value}</li>
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
                                  <li>{data.lat.value}</li>
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
                                  <li>{data.long.value}</li>
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
                                  <li>{data.country.value}</li>
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
                                  <li>{data.Provenance.value}</li>
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
                                  <li>{data.City.value}</li>
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
                                  <li>{data.Suburb.value}</li>
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
                                  <li>{data.Address.value}</li>
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
                                  <li>{data.Postcode.value}</li>
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
          ))||"Please select sensor type or enter your custom query"}
        </div>
      </div>
    
    </div>

    
  );
};
