import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmDialog>) { }

  onClose(): void {
    this.dialogRef.close();
  }
}