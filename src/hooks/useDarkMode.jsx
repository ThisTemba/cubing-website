import useLocalStorage from "./useLocalStorage";
import { useEffect, createContext } from "react";

const DarkModeContext = createContext(true);
export default DarkModeContext;

export function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode-enabled", true);

  useEffect(() => {
    // Source: https://stackoverflow.com/a/19844757/3593621
    const dark = document.getElementById("dark-mode-css");
    const light = document.getElementById("light-mode-css");
    if (darkMode) {
      dark.rel = "stylesheet";
      light.rel = "stylesheet alternate";
    } else {
      light.rel = "stylesheet";
      dark.rel = "stylesheet alternate";
    }
  }, [darkMode]);
  return [darkMode, setDarkMode];
}
