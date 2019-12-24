import { Relative } from './relative.model';

export interface Student {
  id?: string;
  name: string;
  surname: string;
  fatherName?: string;
  group?: string;
  birthDate: number;
  passedLessons?: number;
  visitedLessons?: number;
  relatives: Relative[];
}