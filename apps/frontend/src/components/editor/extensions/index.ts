import { SceneHeading } from "./SceneHeading";
import { Action } from "./Action";
import { Character } from "./Character";
import { Dialogue } from "./Dialogue";
import { Parenthetical } from "./Parenthetical";
import { Transition } from "./Transition";

export const ScreenplayExtensions = [
  SceneHeading,
  Action,
  Character,
  Dialogue,
  Parenthetical,
  Transition,
];

export * from "./SceneHeading";
export * from "./Action";
export * from "./Character";
export * from "./Dialogue";
export * from "./Parenthetical";
export * from "./Transition";
