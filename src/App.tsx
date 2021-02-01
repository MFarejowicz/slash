import { useState } from "react";
import { Slash } from "./components/slash";
import { generateSequence } from "./generateSequence";
import "./App.css";

const DEFAULT = ["j", "j", "f", "f", "k", "j", "f"];

function App() {
  const [sequence, setSequence] = useState(DEFAULT);

  const onAdvance = () => {
    const sequence = generateSequence();
    setSequence(sequence);
  };

  return (
    <div className="App">
      <div>Way of the Slash!</div>
      <Slash sequence={sequence} onAdvance={onAdvance} />
    </div>
  );
}

export default App;
