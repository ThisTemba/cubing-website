import useLocalStorage from "./useLocalStorage";

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode-enabled", true);
  return [darkMode, setDarkMode];
}
