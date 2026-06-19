import { demoName, demoPlate } from './data/demo-data.js';

export function normalizePlate(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toUpperCase();
}

export function isValidPlate(value: string): boolean {
  return normalizePlate(value) === demoPlate;
}

export function isValidName(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed === demoName;
}
