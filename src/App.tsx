import { useEffect } from "react";
import { db } from "./firebase";
import "./App.css";

function App() {
  useEffect(() => {
    db.ref("/").once("value", (t) => console.log(t.val()));
  }, []);

  return (
    <div className="App">
      <div>Way of the Slash!</div>
    </div>
  );
}

export default App;
