import "./App.css";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import ApexChart from "./apexchart";
import SignInScreen from "./sign-in";
import { getAuth, signOut } from "firebase/auth";

const TIME_RANGE_IN_MILLISECONDS = 30 * 1000;

function App() {
  const [connection, setConnection] = useState(null);
  const [val, setVal] = useState(null);
  const [data, setData] = useState([{ x: new Date(), y: 0 }]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const auth = getAuth();

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

  return (
    <div>
      {isSignedIn ? (
        <div>
          <ApexChart
            dataList={[{ name: "values", data: data }]}
            range={TIME_RANGE_IN_MILLISECONDS}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#3f51b5",
                color: "white",
                border: "none",
                fontWeight: "500",
              }}
              onClick={() =>
                signOut(auth).then(() => {
                  setIsSignedIn(false);
                })
              }
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <SignInScreen setIsSignedIn={setIsSignedIn} />
      )}
    </div>
  );
}

export default App;
