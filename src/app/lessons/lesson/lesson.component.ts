import { Component, OnInit, Input } from '@angular/core';

import { PersonalLesson, CommonLesson } from '../../shared/models/lesson.model';
import { StudentService } from '../../shared/services/student.service';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit {
  @Input() lesson: CommonLesson | PersonalLesson;
  students: Student[] = [];
  groupId: string;

  constructor(private ss: StudentService) { }

  ngOnInit() {
    if (this.lesson.kind === 'common') {
      this.groupId = (this.lesson as CommonLesson).groupId;
    }
    if (this.lesson.kind === 'personal') {
      this.ss.getStudents();
      this.ss.studentsChanged.subscribe(students => {
        this.students = students;
      });
    }
  }

  getStudentName(id: string) {
  }

}
