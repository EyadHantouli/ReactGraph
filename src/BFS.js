import { useState } from "react";
import "./bfs.css"
import { Queue } from "./Queue";


const Cell = ({ x, y, state, onClick }) => {
  
    return <div 
    onClick={() => onClick(x, y)}
    className=
        { state === 0 ? "not-visited" :
          state === -1 ? "wall" :
          state === 2 ? "start" : 
          state === 1 ? "visited" :
          state === 4 ? "path" : "goal" }
    ></div>;
  };

const BFS = () => {

    const WIDTH = 10;
    const HEIGHT = 10;
    const SPEED = 50;
    const [pen, setPen] = useState(-1);
    const [start, setStart] = useState([0, 0]);
    const [finish, setfinish] = useState([WIDTH-1, HEIGHT-1]);

    const [pointer, setPointer] = useState(0);
    let algorithm = ["BFS", "DFS"];

    const [grid, setGrid] = useState(() => {
        const initialGrid = [];
        for (let i = 0; i < WIDTH; i++) {
          let buffer = [];
          for (let j = 0; j < HEIGHT; j++) {
            buffer.push(0);
          }
          initialGrid.push(buffer);
        }
        initialGrid[start[0]][start[1]] = 2;
        initialGrid[finish[0]][finish[1]] = 3;
        return initialGrid;
      });

    const handleCellClick = (x, y) => {
            const newGrid = [...grid];
            if (x === start[0] && y === start[1] && pen !== 2) return;
            if (x === finish[0] && y === finish[1] && pen !== 3) return;
            if (pen === 2) {
                newGrid[start[0]][start[1]] = 0;
                setStart([x, y]);
            } else if (pen === 3) {
                newGrid[finish[0]][finish[1]] = 0;
                setfinish([x, y]);
            }
            newGrid[x][y] = pen;
            setGrid(newGrid);
      };

    function run() {
        if (algorithm[pointer] === "BFS") {
            runBFS();
        } else if (algorithm[pointer] === "DFS") {
            runDFS();
        }
    }

    function runDFS() {
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        const stack = [];
        stack.push([start, []]);
        function doWhile () {
            let item = stack.pop();
            item[1].push(item[0]);
            let path = item[1];

            let a, b;
            let x = item[0][0];
            let y = item[0][1];
            if ( x === finish[0] && y === finish[1]){
                let index = path.length-2;
                function convert() {
                    document.querySelector
                    (`.bfs-grid div:nth-child(${10*path[index][0]+path[index][1]+1})`)
                    .className = 'path';
                    index--;
                    if (index > 0) setTimeout(() => { convert(); }, SPEED)
                }
                convert();
                return;
            }

            const newGrid = [...grid];
            
            directions.forEach(dir => {
                a = x + dir[0];
                b = y + dir[1];
                if ((a >= 0 && b >= 0) && (a <= HEIGHT-1 && b <= WIDTH-1)) {
                    if (newGrid[a][b] === 0) {
                        stack.push([[a, b], [...path]]);
                        newGrid[a][b] = 1;
                    } else if (newGrid[a][b] === 3) {
                        stack.push([[a, b], [...path]]);
                    }
                }
            })
            setGrid(newGrid);
            if (stack.length > 0) setTimeout(() => { doWhile(); }, SPEED);
        }
        doWhile();
    }

    function runBFS() {
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        const queue = new Queue();
        queue.enqueue([start, []]);
        function doWhile () {
            let item = queue.dequeue();
            item[1].push(item[0]);
            let path = item[1];

            let a, b;
            let x = item[0][0];
            let y = item[0][1];
            if ( x === finish[0] && y === finish[1]){
                let index = path.length-2;
                function convert() {
                    document.querySelector
                    (`.bfs-grid div:nth-child(${10*path[index][0]+path[index][1]+1})`)
                    .className = 'path';
                    index--;
                    if (index > 0) setTimeout(() => { convert(); }, SPEED)
                }
                convert();
                return;
            }

            const newGrid = [...grid];
            
            directions.forEach(dir => {
                a = x + dir[0];
                b = y + dir[1];
                if ((a >= 0 && b >= 0) && (a <= HEIGHT-1 && b <= WIDTH-1)) {
                    if (newGrid[a][b] === 0) {
                        queue.enqueue([[a, b], [...path]]);
                        newGrid[a][b] = 1;
                    } else if (newGrid[a][b] === 3) {
                        queue.enqueue([[a, b], [...path]]);
                    }
                }
            })
            setGrid(newGrid);
            if (queue.size() > 0) setTimeout(() => { doWhile(); }, SPEED);
        }
        doWhile();
    }

    const clear = () => {
        const newGrid = [...grid];
        for (let i = 0; i < HEIGHT; i++) {
            for (let j = 0; j < WIDTH; j++) {
                if (newGrid[i][j] !== 2 && newGrid[i][j] !== 3) newGrid[i][j] = 0;
            }
        }
        setGrid(newGrid);
    }

    return (
        <>
            <div className="pen-controls container">
                <main>
                    <div onClick={() => {setPen(2)}}>Start</div>

                    <div onClick={() => {setPen(3)}}>Finish</div>

                    <div onClick={() => {setPen(-1)}}>Wall</div>

                    <div onClick={() => {setPen(0)}}>Empty</div>

                    <div onClick={() => {run()}}>Run</div>
                    
                    <div onClick={() => {clear()}}>Clear</div>

                    <div className="algo-handler" onClick={() => {
                            setPointer(curr => (curr + 1) % algorithm.length);
                            document.querySelector(".algo-handler").style.color = "black";
                            setTimeout(() => {
                                document.querySelector(".algo-handler").style.color = "white";
                            }, 300)
                        }}>
                        {algorithm[pointer]}
                    </div>
                </main>
            </div>
            <div className="bfs-grid">
                {grid.map((row, rowIndex) => {
                return row.map((cellState, colIndex) => (
                    <Cell
                    key={`${rowIndex}-${colIndex}`}
                    x={rowIndex}
                    y={colIndex}
                    state={cellState}
                    onClick={handleCellClick}
                    />
                ));
                })}
            </div>
            
        </>
    );
};

export default BFS;