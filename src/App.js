import { useMemo } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useAuthState, UserContext, usersRef } from "./fire";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Navbar from "./components/Navbar";
import TrainPage from "./components/pages/trainPage";
import TimePage from "./components/pages/timePage";
import StatsPage from "./components/pages/statsPage";
import SettingsPage from "./components/pages/settingsPage";
import PasswordReset from "./components/passwordReset";
import SignUp from "./components/signUp";
import LogIn from "./components/logIn";
import useDarkMode from "./hooks/useDarkMode";

function App() {
  const user = useAuthState();
  const [userDoc, loading, error] = useDocumentData(usersRef.doc(user?.uid));
  const userObj = useMemo(() => ({ user, userDoc }), [user, userDoc]);

  useDarkMode();
  return (
    <UserContext.Provider value={userObj}>
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
    </UserContext.Provider>
  );
}

export default App;
