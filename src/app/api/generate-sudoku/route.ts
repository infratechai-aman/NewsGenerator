import { NextResponse } from 'next/server';
import { generateSudokuData, renderSudokuToDataUrl } from '@/lib/sudoku';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    const data = generateSudokuData('easy');
    const imageDataUrl = renderSudokuToDataUrl(data.puzzle);

    return NextResponse.json({
      success: true,
      content: {
        id: uuidv4(),
        difficulty: data.difficulty,
        imageDataUrl,
      },
    });
  } catch (error) {
    console.error('Sudoku generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate Sudoku' },
      { status: 500 }
    );
  }
}
