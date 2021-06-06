import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import { IGameMap } from './domain/game/map/game-map';
import { createWebsocketGameConnector } from './infrastructure/wss/game-connector';

function App() {
  const [level, setLevel] = useState(1);
  const [map, setMap] = useState<IGameMap>({
    rows: []
  });

  useEffect(() => {
    async function createGame() {
      const connector = await createWebsocketGameConnector();
      const game = await connector.createGame(level);
      const map = await game.getMap();

      setMap(map);
    }

    createGame();
  }, [level]);

  return (
    <div className="App">
      <button onClick={() => setLevel(1)}>Set level to 1</button>
      <button onClick={() => setLevel(2)}>Set level to 2</button>
      <button onClick={() => setLevel(3)}>Set level to 3</button>
      <button onClick={() => setLevel(4)}>Set level to 4</button>
      <button onClick={() => setLevel(5)}>Set level to 5</button>
      <button onClick={() => setLevel(6)}>Set level to 6</button>
      <br></br>
      <br></br>
      <br></br>
      {map.rows.map((row, rowIndex) => <div key={row.map(c => c.symbol).join('')}>
        {
          row.map((cell, cellIndex) => <span key={cellIndex + cell.symbol} className={`cell ${['╸', '╻', '╺', '╹'].includes(cell.symbol) ? 'hifen': ''}`} onClick={() => {
            console.log(cell, cell.rotate());
            const currentMap = {
              rows: map.rows
            };

            currentMap.rows[rowIndex][cellIndex] = cell.rotate();

            setMap(currentMap)
          }}>{cell.symbol}</span>)
        }
      <br>
      </br>
      </div>
      )}
    </div>
  );
}

export default App;
