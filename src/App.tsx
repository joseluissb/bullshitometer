import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import BottomSheet from "./components/BottomSheet";
import Thermometer from "./components/Thermometer";
import WordList from "./components/WordList";
import { startTracking, subscribeToBullshitUnits } from "./services/detector";
import { defaultBullshitWords } from "./utils/defaults";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f0f0;
  font-family: Arial, sans-serif;

  margin-top: -2rem;

  @media (min-width: 768px) {
    padding: 40px;
  }

  @media (min-width: 1024px) {
    padding: 60px;
  }
`;

const BottomSheetContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Slider = styled.input`
  margin: 10px 0 3rem 0;
  width: 100%;

  @media (min-width: 768px) {
    width: 400px;
  }

  @media (min-width: 1024px) {
    width: 500px;
  }
`;

const App: React.FC = () => {
  const [bullshitUnits, setBullshitUnits] = useState(100);
  const [words, setWords] = useState<string[]>(defaultBullshitWords);

  // Subscribe once to changes in measured bullshit units
  useEffect(() => {
    subscribeToBullshitUnits((bullshitUnits: number) => {
      setBullshitUnits(bullshitUnits);
    });
  }, []);

  // React to words updates in UI to track them
  useEffect(() => {
    startTracking(words);
  }, [words]);

  return (
    <AppContainer>
      <h1>Bullshitometer</h1>
      <Thermometer bullshitUnits={bullshitUnits} />
      <BottomSheet onClose={() => {}}>
        <BottomSheetContainer>
          <WordList words={words} setWords={setWords} />
          <label htmlFor="bullshit-slider">Set bullshit units manually: {bullshitUnits}</label>
          <Slider
            id="bullshit-slider"
            type="range"
            min="0"
            max="10000"
            value={bullshitUnits}
            onChange={(e) => setBullshitUnits(Number(e.target.value))}
          />
        </BottomSheetContainer>
      </BottomSheet>
    </AppContainer>
  );
};

export default App;
