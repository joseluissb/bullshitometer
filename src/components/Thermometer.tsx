import { motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import icon from "../assets/icon-small.png";
import { LevelName, getLevelFromUnits, levels, maxbullshitUnits } from "../services/levels";

type ThermometerProps = {
  bullshitUnits: number;
};

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ThermometerBody = styled.div<{ color: string }>`
  width: 30px;
  height: 200px;
  background: ${({ color }) => color};
  border-radius: 25px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: background-color 1s ease;
  margin-left: 20px;

  @media (min-width: 768px) {
    width: 40px;
    height: 250px;
  }

  @media (min-width: 1024px) {
    width: 60px;
    height: 300px;
  }
`;

const Mercury = styled(motion.div)<{ height: number }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${({ height }) => height}%;
  background: red;
  transition: height 0.5s ease-out;
`;

const WarningText = styled.div<{ units: number }>`
  font-size: 18px;
  color: ${({ units }) =>
    units >= levels.critical.thresholdUnits ? "red" : units >= levels.warning.thresholdUnits ? "orange" : "green"};
  font-weight: bold;
  margin-top: 2rem;
  text-align: center;
  text-wrap: balance;

  @media (min-width: 768px) {
    font-size: 24px;
  }

  @media (min-width: 1024px) {
    font-size: 28px;
  }
`;

const Alarm = styled.div<{ show: string }>`
  display: ${({ show }) => (show === "true" ? "block" : "none")};
  color: red;
  font-size: 24px;
  margin-top: 20px;
  font-weight: bold;
  text-align: center;
  text-wrap: balance;
  animation: ${pulseAnimation} 0.5s infinite;

  @media (min-width: 768px) {
    font-size: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }
`;

const Thermometer: React.FC<ThermometerProps> = ({ bullshitUnits }) => {
  const [, setBullshitUnits] = useState(bullshitUnits);
  const [level, setLevel] = useState(LevelName.normal);

  useEffect(() => {
    setBullshitUnits(bullshitUnits);
    setLevel(getLevelFromUnits(bullshitUnits));
  }, [bullshitUnits]);

  const levelData = levels[level];
  const isAlarmOn = levelData.name === LevelName.critical;
  // Calculate percentage of the thermometer filled with bullshit, max is 100%
  const bullshitPercentage = Math.min(Math.ceil((bullshitUnits / maxbullshitUnits) * 100), 100);

  return (
    <Container>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={icon} alt="icon" />
        <ThermometerBody color={levelData.color}>
          <Mercury
            height={bullshitUnits}
            initial={{ height: 0 }}
            animate={{ height: `${bullshitPercentage}%` }}
            transition={{ duration: 1 }}
          />
        </ThermometerBody>
      </div>
      <WarningText units={bullshitUnits}>{levelData.message}</WarningText>
      <Alarm show={isAlarmOn.toString()}>🚨 BULLSHIT ALARM ACTIVATED! 🚨</Alarm>
    </Container>
  );
};

export default Thermometer;
