import { createGameMap, IGameMap } from '../../domain/game/map/game-map';

interface ICoordinate {
  x: number;
  y: number;
}

export type ICommand = {
  type: 'map';
} | {
  type: 'rotate';
  params: ICoordinate | ICoordinate[];
} | {
  type: 'verify';
} | {
  type: 'new';
  params: number;
};

export type ICommandResult = {
  type: 'map';
  response: IGameMap;
} | {
  type: 'rotate';
  response: boolean;
} | {
  type: 'new'
  response: boolean;
} | {
  type: 'verify'
  response: boolean;
} | {
  type: 'none'
};

export function encodeCommand(command: ICommand): string {
  if (command.type === 'map') return 'map';

  if (command.type === 'new') return `new ${command.params}`;

  if (command.type === 'rotate') {
    const coordinates = Array.isArray(command.params) ? command.params.map(coord => `${coord.x} ${coord.y}`).join('\n') : `${command.params.x} ${command.params.y}`
    return `rotate ${coordinates}`;
  }

  if (command.type === 'verify') {
    return 'verify'
  }

  return ''
}

export function parseMessage(message: string): ICommandResult {
  if (message.startsWith('map:')) {
    return {
      type: 'map',
      response: createGameMap(message.replace('map:\n', ''))
    }
  } else if (message.startsWith('rotate:')) {
    return {
      type: 'rotate',
      response: message.includes('OK')
    }
  } else if (message.startsWith('new:')) {
    return {
      type: 'new',
      response: message.includes('OK')
    }
  } else {
    return {
      type: 'none'
    }
  }
}