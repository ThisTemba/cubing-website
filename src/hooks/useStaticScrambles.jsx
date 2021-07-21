import { useState } from "react";
import scrambles from "../data/scrambles";

const useStaticScrambles = () => {
  const [index, setIndex] = useState(
    Math.floor(Math.random() * scrambles.length)
  );
  const nextScramble = () => {
    const newIndex = index + 1 < scrambles.length ? index + 1 : 0;
    setIndex(newIndex);
  };
  return [scrambles[index], nextScramble];
};
export default useStaticScrambles;
