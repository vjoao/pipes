export interface ICell {
  connections: ICellConnections,
  symbol: CellSymbol;
  rotate(): ICell;
}

export interface IGameMap {
  rows: ICell[][];
}

interface ICellConnections {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
};

type CellSymbol =
  | "╸"
  | "╹"
  | "╺"
  | "╻"
  | "━"
  | "┃"
  | "┓"
  | "┛"
  | "┗"
  | "┏"
  | "┣"
  | "┳"
  | "┫"
  | "┻"
  | "╋"

function createCell(symbol: CellSymbol): ICell {
  const symbolMap: Record<CellSymbol, {
    rotation: CellSymbol,
    connections: ICellConnections
  }> = {
    "╸": {
      rotation: "╹",
      connections: {
        left: true,
      }
    },
    "╹": {
      rotation: "╺",
      connections: {
        top: true,
      }
    },
    "╺": {
      rotation: "╻",
      connections: {
        right: true,
      }
    },
    "╻": {
      rotation: "╸",
      connections: {
        bottom: true,
      }
    },
    "━": {
      rotation: "┃",
      connections: {
        left: true,
        right: true
      }
    },
    "┃": {
      rotation: "━",
      connections: {
        top: true,
        bottom: true
      }
    },
    "┓": {
      rotation: "┛",
      connections: {
        left: true,
        bottom: true
      }
    },
    "┛": {
      rotation: "┗",
      connections: {
        top: true,
        left: true
      }
    },
    "┗": {
      rotation: "┏",
      connections: {
        top: true,
        right: true
      }
    },
    "┏": {
      rotation: "┓",
      connections: {
        right: true,
        bottom: true
      }
    },
    "┣": {
      rotation: "┳",
      connections: {
        top: true,
        right: true,
        bottom: true
      }
    },
    "┳": {
      rotation: "┫",
      connections: {
        right: true,
        left: true,
        bottom: true
      }
    },
    "┫": {
      rotation: "┻",
      connections: {
        top: true,
        bottom: true
      }
    },
    "┻": {
      rotation: "┣",
      connections: {
        top: true,
        right: true,
        left: true
      }
    },
    "╋": {
      rotation: "╋",
      connections: {
        top: true,
        right: true,
        bottom: true,
        left: true,
      }
    }
  }

  const cellDef: Omit<ICell, 'rotate'> = {
    connections: symbolMap[symbol].connections,
    symbol: symbol,
  }

  return {
    ...cellDef,
    rotate() {
      return createCell(symbolMap[symbol].rotation)
    }
  }
}

export function createGameMap(map: string): IGameMap {
  const lines = map.split('\n').filter(line => !!line);
  const rows: ICell[][] = [];

  for (const line of lines) {
    const currentCells = [];

    const symbols = line.split('') as CellSymbol[];

    for (const symbol of symbols) {
      currentCells.push(createCell(symbol));
    }

    rows.push(currentCells);
  }

  return {
    rows
  }
}