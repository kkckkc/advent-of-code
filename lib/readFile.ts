import path from 'path';
import fs from 'fs';

export const readFile = (directory: string, filename='input.txt'): string[] => {
  return fs.readFileSync(path.join(directory, filename)).toString().trim().split('\n');
}