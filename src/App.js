import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import TrainPage from "./components/pages/trainPage";
import TimePage from "./components/pages/timePage";
import StatsPage from "./components/pages/statsPage";
import TestPage from "./components/pages/testPage";
import PasswordReset from "./components/passwordReset";
import SignUp from "./components/signUp";
import LogIn from "./components/logIn";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route path="/train/test" component={TestPage} />
        <Route path="/time" component={TimePage} />
        <Route path="/train" component={TrainPage} />
        <Route path="/stats" component={StatsPage} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={LogIn} />
        <Route path="/password_reset" component={PasswordReset} />
        <Redirect path="/" to="/time" />
      </Switch>
    </div>
  );
}

export default App;
