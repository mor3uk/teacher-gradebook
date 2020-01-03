import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-picker',
  templateUrl: './student-picker.component.html',
  styleUrls: ['./student-picker.component.scss']
})
export class StudentPickerComponent implements OnInit {
  @Input() students: Student[];
  @Input() pickedStudents: Student[];
  @Input() studentMode: boolean;
  @Input() selectedStudent: Student;

  @Output() studentSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() studentUnselected: EventEmitter<void> = new EventEmitter<void>();
  @Output() allPicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() newStudentToAdd: EventEmitter<void> = new EventEmitter<void>();
  @Output() studentPicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() studentDeleted: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onSelectStudent(e: Event) {
    this.studentSelected.emit((e.target as HTMLInputElement).value);
    (e.target as HTMLInputElement).value = '';
  }

  onPickAll() {
    this.allPicked.emit();
  }

  onAddNewStudent() {
    this.newStudentToAdd.emit();
  }

  onUnselectStudent() {
    this.studentUnselected.emit();
  }

  onPickStudent() {
    this.studentPicked.emit();
  }

  onDeleteStudent(id: string) {
    this.studentDeleted.emit(id);
  }

}
