import { IGameConnector } from '../game-connector';
import { encodeCommand, ICommand, ICommandResult, parseMessage } from './protocol';

import { IGame } from '../../domain/game/game';
import { IGameMap } from '../../domain/game/map/game-map';

function sendCommand<C extends ICommand>(connection: WebSocket, command: C): Promise<ICommandResult> {
  return new Promise((resolve, reject) => {
    connection.onmessage = (messageEvent) => {
      connection.onmessage = null;

      const commandResult = parseMessage(messageEvent.data);
      if (commandResult.type !== 'none') {
        resolve(commandResult);
      } else {
        reject(new Error(`Could not execute command: ${command.type}. Repsonse: ${messageEvent.data}`));
      }
    }

    connection.send(encodeCommand(command))
  });
}

export async function createWebsocketGameConnector(): Promise<IGameConnector> {
  const websocketConnection = new WebSocket('wss://hometask.eg1236.com/game-pipes/');

  return new Promise((resolve) => {

    const gameConnector: IGameConnector = {
      async createGame(level: number): Promise<IGame> {
        await sendCommand(websocketConnection, {
          type: 'new',
          params: level
        });

        return {
          async getMap(): Promise<IGameMap> {
            const mapResult = await sendCommand(websocketConnection, {
              type: 'map'
            });

            if (mapResult.type === 'map') {
              return mapResult.response
            }

            return {
              rows: []
            }
          },
          async verify(): Promise<boolean> {
            const verifyCommand = await sendCommand(websocketConnection, {
              type: 'verify'
            });

            if (verifyCommand.type === 'verify') {
              return verifyCommand.response
            }

            return false;
          }
        }
      }
    }

    websocketConnection.onopen = () => {
      resolve(gameConnector);
    }
  });
}