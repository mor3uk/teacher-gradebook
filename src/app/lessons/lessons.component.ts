import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AddLessonComponent } from './add-lesson/add-lesson.component';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  onAddLesson() {
    this.dialog.open(AddLessonComponent, { panelClass: 'overlay-narrow' })
      .afterClosed()
      .subscribe(lesson => {
        console.log(lesson);
      });
  }

}
