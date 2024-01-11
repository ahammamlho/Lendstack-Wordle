import * as React from "react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { DataDTO } from "../dto/dataDto";
import WordGenerator from "../utils/wordGenerator";
import ValideDataGame from "../utils/valideDataGame";

interface ContextProps {
  data: DataDTO;
  setData: Dispatch<SetStateAction<DataDTO>>;
}

const GlobalContext = createContext<ContextProps>({
  data: {
    isGameOver: false,
    word: "",
    guesses: [],
    numAttempts: 0,
    played: 0,
    numWins: 0,
  },
  setData: () => {},
});

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<DataDTO>({
    isGameOver: false,
    word: "",
    guesses: ["*****", "*****", "*****", "*****", "*****"],
    numAttempts: 0,
    played: 0,
    numWins: 0,
  });

  useEffect(() => {
    const getWold = async () => {
      const storedGameData = localStorage.getItem("myGameData");
      let isValide: DataDTO | null = null;
      if (storedGameData) {
        try {
          const tmpData = JSON.parse(storedGameData);
          isValide = await ValideDataGame(data, tmpData);
        } catch (error) {}
      }
      if (isValide === null) {
        const tmp = await WordGenerator();
        if (tmp) {
          setData((preValue) => {
            let newData = { ...preValue };
            newData.word = tmp.toUpperCase();
            localStorage.setItem("myGameData", JSON.stringify(newData));
            return newData;
          });
        }
      } else {
        setData(isValide);
      }
    };
    getWold();
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
