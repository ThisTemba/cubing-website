import { Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import TrainPage from "./components/trainPage";
import TimePage from "./components/timePage";
import PasswordReset from "./components/passwordReset";
import SignUp from "./components/signUp";
import LogIn from "./components/logIn";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Route path="/time" component={TimePage} />
      <Route path="/train" component={TrainPage} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={LogIn} />
      <Route path="/password_reset" component={PasswordReset} />
    </div>
  );
}

export default App;
