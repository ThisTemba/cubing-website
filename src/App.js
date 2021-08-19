import { useMemo } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useAuthState, UserContext } from "./fire";
import Navbar from "./components/Navbar";
import TrainPage from "./components/pages/trainPage";
import TimePage from "./components/pages/timePage";
import StatsPage from "./components/pages/statsPage";
import SettingsPage from "./components/pages/settingsPage";
import PasswordReset from "./components/passwordReset";
import SignUp from "./components/signUp";
import LogIn from "./components/logIn";
import useDarkMode, { DarkModeContext } from "./hooks/useDarkMode";
import useUserDoc from "./hooks/useUserDoc";

function App() {
  const user = useAuthState();
  const userDoc = useUserDoc();
  const userObj = useMemo(() => ({ user, userDoc }), [user, userDoc]);
  const [darkMode, setDarkMode] = useDarkMode(true);
  const darkModeObj = useMemo(
    () => ({ darkMode, setDarkMode }),
    [darkMode, setDarkMode]
  );

  return (
    <UserContext.Provider value={userObj}>
      <DarkModeContext.Provider value={darkModeObj}>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/time" component={TimePage} />
            <Route path="/train" component={TrainPage} />
            <Route path="/stats" component={StatsPage} />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={LogIn} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/password_reset" component={PasswordReset} />
            <Redirect path="/" to="/time" />
          </Switch>
        </div>
      </DarkModeContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
