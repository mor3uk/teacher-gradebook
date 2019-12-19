export interface Student {
  id?: string;
  name: string;
  surname: string;
  fatherName?: string;
  groupId?: string;
  birthDate: number;
  passedLessons?: number;
  visitedLessons?: number;
}