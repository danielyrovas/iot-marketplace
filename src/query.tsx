

export const QueryPage = () => {
  return (
    <div>
        <div className="flex flex-row gap-4">
            <button>Get All Camera Sensors</button>
            <button>Get All Milk Pressure Sensors</button>
            <button>Get All Air Temperature Sensors</button>
            <button>Get All Air Humidity Sensors</button>
            <button>Get All Milk Temperature Sensors</button>
            <button>Get All Sensors in Australia</button>
        </div>
        <div className="grid grid-cols-4 gap-4">
            <div>
                <img src="https://picsum.photos/200/300" />
            </div>
        </div>
    </div>
  )
}
