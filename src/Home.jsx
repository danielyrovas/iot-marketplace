import { createSignal } from "solid-js";

export default function Home() {
  const data = [
    {
      image: "https://picsum.photos/id/42/200/200",
      title: "Sensor 1",
    },
    {
      image: "https://picsum.photos/id/43/200/200",
      title: "Sensor 2",
    },
    {
      image: "https://picsum.photos/id/44/200/200",
      title: "Sensor 3",
    },
  ];

  const [openLocation, setOpenLocation] = createSignal(false);
  const [openSensorType, setOpenSensorType] = createSignal(false);
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
      location: "Tasmania",
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
      location: "Gold Coast",
      sensortype: "2",
      person: "7",
    },
    {
      location: "Darwin",
      sensortype: "6",
      person: "8",
    },
    {
      location: "Melbourne",
      sensortype: "1",
      person: "9",
    },
    {
      location: "Darwin",
      sensortype: "2",
      person: "3",
    },
  ]
  const result = datadummy.filter(element => element.sensortype === "6" && element.location === "Darwin")
  console.log(result)
  return (
    <div className="mx-auto p-8 w-full max-w-[1200px] flex flex-col gap-8">
      <div className="flex flex-row gap-4">
        <button>Get All Camera Sensors</button>
        <button>Get All Milk Pressure Sensors</button>
        <button>Get All Air Temperature Sensors</button>
        <button>Get All Air Humidity Sensors</button>
        <button>Get All Milk Temperature Sensors</button>
        <button>Get All Sensors in Australia</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {data.map((data, index) => (
          <div
            className="bg-white p-4 rounded-lg flex flex-col gap-4"
            key={index}
          >
            <img src={data.image} />
            <p>{data.title}</p>
          </div>
        ))}
      </div>
      <div className="">
        <button
          onClick={() => {
            setOpenLocation(true);
            console.log(openLocation);
          }}
        >
          Location
        </button>
        <button
          onClick={() => {
            setOpenSensorType(true);
            console.log(openSensorType);
          }}
        >
          Sensor Type
        </button>
      </div>
      {/* {!openLocation && (
        <div className={`flex items-center justify-center fixed inset-0 backdrop-blur`}>
          <div className="flex flex-col gap-4 w-full max-w-sm border rounded p-4 bg-white">
            <div className="flex justify-between">
              <div>Location</div>
              <button
                onClick={() => {
                  setOpenLocation(!open);
                  console.log(open)
                }}
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <select className="p-2 border" name="" id="">
                <option value="Australia">Australia</option>
              </select>
              <select className="p-2 border" name="" id="">
                <option value="State">State</option>
              </select>
              <select className="p-2 border" name="" id="">
                <option value="City">City</option>
              </select>
            </div>
          </div>
        </div>
      )} */}
      {/* <div className={`flex items-center justify-center fixed inset-0 backdrop-blur`} */}
      >
        <div className="flex flex-col gap-4 w-full max-w-sm border rounded p-4 bg-white">
          <div className="flex justify-between">
            <div>Sensor Type</div>
            <button
              onClick={() => {
                setOpen(!open);
                console.log(open);
              }}
            >
              Close
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <input type="radio" id="sensor1" name="sensor1" value="sensor1"  />
              <label for="sensor1">Sensor 1</label></div>
              <div>   <input type="radio" id="sensor2" name="sensor2" value="sensor2" />
              <label for="sensor2">sensor 2</label></div>
              <div> <input type="radio" id="sensor3" name="sensor3" value="sensor3" />
              <label for="sensor3">sensor 3</label></div>
              <div><input type="radio" id="sensor4" name="sensor4" value="sensor4" />
              <label for="sensor4">sensor 4</label></div>
              <div><input type="radio" id="sensor5" name="sensor5" value="sensor5" />
              <label for="sensor5">sensor 5</label></div>
              <div> <input type="radio" id="sensor6" name="sensor6" value="sensor6" />
              <label for="sensor6">sensor 6</label>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}
