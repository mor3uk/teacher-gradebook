export interface Event {
  start: Date;
  end: Date;
}

export interface DayEvent extends Event {
  title: number;
}

export interface LessonEvent extends Event {
  lessonId: string;
  title: string;
}
