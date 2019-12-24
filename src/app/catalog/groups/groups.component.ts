import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { Group } from '../../shared/models/group.model';
import { GroupService } from '../../shared/services/group.service';
import { ConfirmDialog } from '../../shared/modals/confirm.component';
import { GroupFormComponent } from '../forms/group-form/group-form.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  pending: boolean = false;
  groups: Group[] = [];

  constructor(
    private gs: GroupService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.pending = true;
    this.groups = await this.gs.getGroups();
    this.pending = false;
  }

  onAddGroup() {
    this.openDialog('add').subscribe((group) => {

    });
  }

  onEditGroup(group: Group) {
    alert('edit ' + group.name);
  }

  onDeleteGroup(name: string) {
    alert('delete ' + name);
  }

  openDialog(operation: 'delete' | 'add' | 'edit', group?: Group): Observable<any> {
    switch (operation) {
      case 'delete':
        return this.dialog.open(ConfirmDialog).afterClosed();
      case 'add':
        return this.dialog.open(GroupFormComponent, { panelClass: 'overlay-narrow' }).afterClosed();
      case 'edit':
        return this.dialog.open(
          GroupFormComponent, {
          panelClass: 'overlay-narrow',
          data: { group }
        })
          .afterClosed();
    }
  }

}
