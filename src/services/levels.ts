export const maxbullshitUnits = 10000;

export enum LevelName {
  normal = "normal",
  caution = "caution",
  warning = "warning",
  critical = "critical",
}

export type LevelData = {
  name: LevelName;
  thresholdUnits: number;
  message: string;
  color: string;
};

export const levels: Record<LevelName, LevelData> = {
  normal: {
    name: LevelName.normal,
    thresholdUnits: 0,
    message: "Bullshit level: normal",
    color: "lightblue",
  },
  caution: {
    name: LevelName.caution,
    thresholdUnits: maxbullshitUnits * 0.5,
    message: "Caution: High bullshit level",
    color: "orange",
  },
  warning: {
    name: LevelName.warning,
    thresholdUnits: maxbullshitUnits * 0.75,
    message: "Warning: Very High bullshit level",
    color: "darkred",
  },
  critical: {
    name: LevelName.critical,
    thresholdUnits: maxbullshitUnits * 0.9,
    message: "CRITICAL: Overheating! Bullshit over 9000!",
    color: "darkred",
  },
};

export function getLevelFromUnits(bullshitUnits: number): LevelName {
  if (bullshitUnits >= levels.critical.thresholdUnits) {
    return LevelName.critical;
  }
  if (bullshitUnits >= levels.warning.thresholdUnits) {
    return LevelName.warning;
  }
  if (bullshitUnits >= levels.caution.thresholdUnits) {
    return LevelName.caution;
  }
  return LevelName.normal;
}
