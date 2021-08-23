import { useMemo } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useAuthState, UserContext } from "./services/firebase";
import Navbar from "./components/Navbar";
import TrainPage from "./components/pages/trainPage";
import TimePage from "./components/pages/timePage";
import StatsPage from "./components/pages/statsPage";
import SettingsPage from "./components/pages/settingsPage";
import PasswordReset from "./components/passwordReset";
import SignUp from "./components/signUp";
import LogIn from "./components/logIn";
import DarkModeContext, { useDarkMode } from "./hooks/useDarkMode";
import useUserDoc from "./hooks/useUserDoc";
import CaseSetsContext, { useCaseSets } from "./hooks/useCaseSets";

function App() {
  const { user, loading: loadingUser } = useAuthState();
  const userDoc = useUserDoc(user);
  const caseSets = useCaseSets(user, userDoc);
  const userObj = useMemo(() => ({ user, userDoc }), [user, userDoc]);
  const [darkMode, setDarkMode] = useDarkMode(true);
  const darkModeObj = useMemo(
    () => ({ darkMode, setDarkMode }),
    [darkMode, setDarkMode]
  );

  return (
    <UserContext.Provider value={userObj}>
      <DarkModeContext.Provider value={darkModeObj}>
        <CaseSetsContext.Provider value={caseSets}>
          <div className="App">
            <Navbar />
            <Switch>
              <Route path="/train" component={TrainPage} />
              <Route path="/time" component={TimePage} />
              <Route path="/stats" component={StatsPage} />
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={LogIn} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/password_reset" component={PasswordReset} />
              <Redirect path="/" to="/train" />
            </Switch>
          </div>
        </CaseSetsContext.Provider>
      </DarkModeContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
