import { IGameMap } from './map/game-map';

export interface IGame {
  getMap(): Promise<IGameMap>;
  verify(): Promise<boolean>;
}