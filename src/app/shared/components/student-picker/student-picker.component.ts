import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-picker',
  templateUrl: './student-picker.component.html',
  styleUrls: ['./student-picker.component.scss']
})
export class StudentPickerComponent implements OnInit {
  @Input() students: Student[];
  @Input() studentMode: boolean;
  @Input() pickedStudents: Student[] = [];
  selectedStudent: Student;

  @Output() newStudentToAdd = new EventEmitter<void>();
  @Output() pickedStudentsChanged = new EventEmitter<Student[]>();

  ngOnInit() { }

  onSelectStudent(e: Event) {
    const id = (e.target as HTMLInputElement).value;
    this.selectedStudent = this.students.find(student => student.id === id);
    (e.target as HTMLInputElement).value = '';
  }

  onPickAll() {
    this.pickedStudents = [...this.students, ...this.pickedStudents];
    this.students = [];
    this.pickedStudentsChanged.emit([...this.pickedStudents]);
  }

  onAddNewStudent() {
    this.newStudentToAdd.emit();
  }

  onUnselectStudent() {
    this.selectedStudent = null;
  }

  onPickStudent() {
    this.students = this.students.filter(student => {
      if (student.id !== this.selectedStudent.id) {
        return true;
      }
      this.pickedStudents.push(this.selectedStudent);
      return false;
    });
    this.selectedStudent = null;
    this.pickedStudentsChanged.emit([...this.pickedStudents]);
  }

  onDeleteStudent(id: string) {
    this.pickedStudents = this.pickedStudents.filter(student => {
      if (student.id !== id) {
        return true;
      }
      this.students.push(student);
      return false;
    });
    this.pickedStudentsChanged.emit([...this.pickedStudents]);
  }

}
