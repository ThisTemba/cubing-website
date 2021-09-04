import { useState } from "react";
import { getRandomScramble } from "../utils/scrambles/caseScramble";

const useRandomScrambles = () => {
  const [scramble, setScramble] = useState(getRandomScramble());
  const nextScramble = () => {
    setScramble(getRandomScramble());
  };
  return [scramble, nextScramble];
};
export default useRandomScrambles;
