import "./App.css";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import ApexChart from "./apexchart";

var xVal = 0;
//var data = [{ x: new Date(), y: 0 }];
const TIME_RANGE_IN_MILLISECONDS = 30 * 1000;

function App() {
  const [connection, setConnection] = useState(null);
  const [val, setVal] = useState(null);
  const [data, setData] = useState([{ x: new Date(), y: 0 }]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://cn-project-api.herokuapp.com/value")
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");
          connection.on("ReceiveMessage", (val) => {
            console.log(val);
            setVal(val);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  useEffect(() => {
    let aux = [...data, { x: new Date(), y: val }];
    setData(aux);
  }, [val]);

  const renderData = () => {
    return data.map((x, i) => (
      <div index={i}>
        {x.x}, {x.y}
      </div>
    ));
  };
  return (
    <div>
      <ApexChart
        dataList={[{ name: "values", data: data }]}
        range={TIME_RANGE_IN_MILLISECONDS}
      />
    </div>
  );
}

export default App;
