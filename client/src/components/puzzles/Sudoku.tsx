import { useState, useEffect } from "react";
import GameButton from "../ui/GameButton";

interface SudokuProps {
  puzzle: any;
  onAnswer: (answer: number[][]) => void;
  disabled: boolean;
}

export default function Sudoku({ puzzle, onAnswer, disabled }: SudokuProps) {
  const [grid, setGrid] = useState<(number | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  // Generate a simple 4x4 Sudoku puzzle
  const generateSimpleSudoku = () => {
    // Complete solution
    const solution = [
      [1, 2, 3, 4],
      [3, 4, 1, 2], 
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ];
    
    // Create puzzle by removing some numbers
    const puzzle = solution.map(row => [...row]);
    const cellsToRemove = [
      [0, 0], [0, 2], [1, 1], [1, 3],
      [2, 0], [2, 2], [3, 1], [3, 3]
    ];
    
    cellsToRemove.forEach(([row, col]) => {
      puzzle[row][col] = null;
    });
    
    return { puzzle, solution };
  };

  const [sudokuData] = useState(() => generateSimpleSudoku());

  useEffect(() => {
    setGrid(sudokuData.puzzle.map(row => [...row]));
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (!disabled && sudokuData.puzzle[row][col] === null) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = (number: number) => {
    if (!disabled && selectedCell) {
      const [row, col] = selectedCell;
      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = number;
      setGrid(newGrid);
    }
  };

  const handleClearCell = () => {
    if (!disabled && selectedCell) {
      const [row, col] = selectedCell;
      const newGrid = grid.map(row => [...row]);
      newGrid[row][col] = null;
      setGrid(newGrid);
    }
  };

  const handleSubmit = () => {
    const filledGrid = grid.map(row => 
      row.map(cell => cell || 0)
    );
    onAnswer(filledGrid);
  };

  const isGridComplete = () => {
    return grid.every(row => row.every(cell => cell !== null));
  };

  const getCellClass = (row: number, col: number) => {
    const isOriginal = sudokuData.puzzle[row][col] !== null;
    const isSelected = selectedCell && selectedCell[0] === row && selectedCell[1] === col;
    
    let classes = "w-12 h-12 border-2 flex items-center justify-center text-lg font-bold cursor-pointer transition-all ";
    
    if (isOriginal) {
      classes += "bg-gray-200 text-gray-800 cursor-not-allowed ";
    } else if (isSelected) {
      classes += "bg-blue-100 border-blue-500 ";
    } else {
      classes += "bg-white border-gray-300 hover:bg-gray-50 ";
    }
    
    // Add thicker borders for 2x2 sections
    if (row === 1) classes += "border-b-4 border-b-gray-600 ";
    if (col === 1) classes += "border-r-4 border-r-gray-600 ";
    
    return classes;
  };

  return (
    <div className="flex flex-col items-center h-full justify-center space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Мини Судоку 4×4</h2>
        <p className="text-gray-600">
          Заполните сетку цифрами от 1 до 4 так, чтобы в каждой строке, столбце и квадрате 2×2 все цифры встречались только один раз
        </p>
      </div>

      {/* Sudoku Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-4 gap-0 border-4 border-gray-600 rounded-lg overflow-hidden">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Number Input Buttons */}
      {selectedCell && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-center mb-4">
            Выберите цифру для клетки [{selectedCell[0] + 1}, {selectedCell[1] + 1}]:
          </h3>
          
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4].map(number => (
              <button
                key={number}
                className="w-12 h-12 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => handleNumberInput(number)}
                disabled={disabled}
              >
                {number}
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onClick={handleClearCell}
              disabled={disabled}
            >
              Очистить
            </button>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <GameButton
        onClick={handleSubmit}
        disabled={!isGridComplete() || disabled}
        size="lg"
        className="px-8"
      >
        {disabled ? 'Обрабатывается...' : 'Проверить решение'}
      </GameButton>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg text-center text-sm">
        <div className="text-blue-700">
          <strong>Правила:</strong> Нажмите на пустую клетку, чтобы выбрать её, затем выберите цифру. 
          В каждой строке, столбце и квадрате 2×2 должны быть все цифры от 1 до 4.
        </div>
      </div>

      {/* Hint Display */}
      {puzzle.hint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md text-center">
          <div className="text-yellow-700">
            💡 <strong>Подсказка:</strong> {puzzle.hint}
          </div>
        </div>
      )}
    </div>
  );
}
