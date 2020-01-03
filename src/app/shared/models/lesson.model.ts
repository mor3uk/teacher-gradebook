export interface Lesson {
  id?: string;
  studentsInfo: { id: string, absent?: boolean }[];
  startTime: number;
  durationMinutes: number;
  kind: 'common' | 'personal';
}

export interface CommonLesson extends Lesson {
  groupId: string;
}

export interface PersonalLesson extends Lesson {
  price: number;
}
