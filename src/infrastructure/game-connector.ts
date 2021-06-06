import { IGame } from '../domain/game/game';

export interface IGameConnector {
  createGame(level: number): Promise<IGame>;
}