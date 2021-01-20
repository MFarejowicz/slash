import { FirebaseContextManager } from "./firebase";
import "./App.css";

function App() {
  return (
    <FirebaseContextManager>
      <div className="App">
        <div>Way of the Slash!</div>
      </div>
    </FirebaseContextManager>
  );
}

export default App;
