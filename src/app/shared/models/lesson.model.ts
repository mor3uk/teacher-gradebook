export interface Lesson {
  id?: string;
  studentsInfo: {
    id: string,
    attended?: boolean,
    mark?: number,
    behavior?: number,
  }[];
  startTime: number;
  durationMinutes: number;
  kind: 'common' | 'personal';
  studentsMarked?: boolean;
}

export interface CommonLesson extends Lesson {
  groupId: string;
}

export interface PersonalLesson extends Lesson {
  price: number;
}
