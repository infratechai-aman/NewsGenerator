import { getSudoku } from 'sudoku-gen';

export interface SudokuData {
  puzzle: string;
  solution: string;
  difficulty: 'easy' | 'medium';
}

export function generateSudokuData(difficulty: 'easy' | 'medium' = 'easy'): SudokuData {
  const sudoku = getSudoku(difficulty);
  return {
    puzzle: sudoku.puzzle,
    solution: sudoku.solution,
    difficulty,
  };
}

export function renderSudokuSVG(puzzle: string): string {
  const cells = puzzle.split('');
  const cellSize = 50;
  const gridSize = cellSize * 9;
  const padding = 20;
  const totalSize = gridSize + padding * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">`;

  // Background
  svg += `<rect width="${totalSize}" height="${totalSize}" fill="white" rx="8"/>`;

  // Title
  svg += `<text x="${totalSize / 2}" y="15" text-anchor="middle" font-family="'IBM Plex Serif', Georgia, serif" font-size="12" font-weight="600" fill="#1a1a1a">DAILY SUDOKU</text>`;

  const gridOffsetY = padding;
  const gridOffsetX = padding;

  // Draw cells
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const x = gridOffsetX + col * cellSize;
      const y = gridOffsetY + row * cellSize;
      const idx = row * 9 + col;
      const val = cells[idx];

      // Cell background - alternate 3x3 boxes
      const boxRow = Math.floor(row / 3);
      const boxCol = Math.floor(col / 3);
      const isAltBox = (boxRow + boxCol) % 2 === 0;

      svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${isAltBox ? '#f8f6f0' : '#ffffff'}" stroke="#ccc" stroke-width="0.5"/>`;

      if (val !== '-') {
        svg += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 6}" text-anchor="middle" font-family="'IBM Plex Serif', Georgia, serif" font-size="20" font-weight="600" fill="#1a1a1a">${val}</text>`;
      }
    }
  }

  // Bold 3x3 box borders
  for (let i = 0; i <= 3; i++) {
    const pos = gridOffsetX + i * cellSize * 3;
    svg += `<line x1="${pos}" y1="${gridOffsetY}" x2="${pos}" y2="${gridOffsetY + gridSize}" stroke="#333" stroke-width="2.5"/>`;
    const posY = gridOffsetY + i * cellSize * 3;
    svg += `<line x1="${gridOffsetX}" y1="${posY}" x2="${gridOffsetX + gridSize}" y2="${posY}" stroke="#333" stroke-width="2.5"/>`;
  }

  // Outer border
  svg += `<rect x="${gridOffsetX}" y="${gridOffsetY}" width="${gridSize}" height="${gridSize}" fill="none" stroke="#1a1a1a" stroke-width="3" rx="2"/>`;

  svg += '</svg>';
  return svg;
}

export function renderSudokuToDataUrl(puzzle: string): string {
  const svg = renderSudokuSVG(puzzle);
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}
