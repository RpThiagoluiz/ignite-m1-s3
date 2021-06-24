import { useEffect, useState } from "react";

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isbuttonInvisible, setIsButtonInvisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true);
      setIsButtonInvisible(true);
    }, 1000);
  });

  //clear timeout, ele sai da fila e o jest, nao consegue pegar o render dele.

  return (
    <div>
      <div>Hello World!</div>
      {isButtonVisible && <button>ButtonAsync</button>}
      {!isbuttonInvisible && <button>InvisibleButton</button>}
    </div>
  );
}
