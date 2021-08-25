import { useMemo } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Feedback from "feeder-react-feedback"; // import Feedback component
import "feeder-react-feedback/dist/feeder-react-feedback.css";

import TrainPage from "./components/pages/trainPage";
import TimePage from "./components/pages/timePage";
import StatsPage from "./components/pages/statsPage";
import SettingsPage from "./components/pages/settingsPage";

import Navbar from "./components/Navbar";
import SignUp from "./components/signUp";
import LogIn from "./components/logIn";
import PasswordReset from "./components/passwordReset";
import PageSpinner from "./components/common/pageSpinner";

import useUserDoc from "./hooks/useUserDoc";
import DarkModeContext, { useDarkMode } from "./hooks/useDarkMode";
import CaseSetsContext, { useCaseSets } from "./hooks/useCaseSets";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { useAuthState, UserContext } from "./services/firebase";

function App() {
  const user = useAuthState();
  const userDoc = useUserDoc(user);
  const caseSets = useCaseSets(user, userDoc);
  const userObj = useMemo(() => ({ user, userDoc }), [user, userDoc]);
  const [darkMode, setDarkMode] = useDarkMode(true);
  const darkModeObj = useMemo(
    () => ({ darkMode, setDarkMode }),
    [darkMode, setDarkMode]
  );

  const { xs } = useWindowDimensions();

  const loadingUser = typeof user === "undefined";
  const loadingUserDoc = typeof userDoc === "undefined";
  const loadingCaseSets = typeof caseSets === "undefined";
  const loading = loadingUser || loadingUserDoc || loadingCaseSets;

  return (
    <UserContext.Provider value={userObj}>
      <DarkModeContext.Provider value={darkModeObj}>
        <CaseSetsContext.Provider value={caseSets}>
          <div className="App">
            {loading && <PageSpinner />}
            {!loading && (
              <>
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
              </>
            )}
            {!xs && (
              <Feedback
                projectId="61258e09ac9cf500049e116b"
                feedbackTypes={["bug", "idea", "other"]}
                email={true}
                emailDefaultValue={user?.email}
                primaryColor={darkMode ? "#343a40" : "#dee2e6"}
                hoverBorderColor={darkMode ? "#343a40" : "#dee2e6"}
                textColor={darkMode ? "#dee2e6" : "#212529"}
              />
            )}
          </div>
        </CaseSetsContext.Provider>
      </DarkModeContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
