import { createSignal } from "solid-js";

export default function Home() {
  const data = [
    {
      image:"https://picsum.photos/id/42/200/200", 
      title:"Sensor 1",
    },
    {
      image:"https://picsum.photos/id/43/200/200", 
      title:"Sensor 2",
    },
    {
      image:"https://picsum.photos/id/44/200/200", 
      title:"Sensor 3",
    }
  ]
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
      {data.map((data,index) => (
                    <div className="bg-white p-4 rounded-lg flex flex-col gap-4" key={index}>
                    <img src={data.image} />
                    <p>{data.title}</p>
                </div>
      ))}

        </div>
    <div className=""></div>
</div>
  );
}
