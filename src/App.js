import { Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import TrainPage from "./components/trainPage";
import TimePage from "./components/timePage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Route path="/time" component={TimePage} />
      <Route path="/train" component={TrainPage} />
    </div>
  );
}

export default App;
