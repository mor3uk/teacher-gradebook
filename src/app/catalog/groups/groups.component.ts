import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';

import { Group } from '../../shared/models/group.model';
import { GroupService } from '../../shared/services/group.service';
import { StudentService } from '../../shared/services/student.service';
import { ConfirmDialog } from '../../shared/components/confirm/confirm.component';
import { GroupFormComponent } from './group-form/group-form.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, OnDestroy {
  pending = false;
  groups: Group[] = [];
  groupsSub: Subscription;

  constructor(
    private gs: GroupService,
    private ss: StudentService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.getGroupsWithPending();
    this.groupsSub = this.gs.groupsChanged
      .subscribe(groups => {
        this.groups = groups;
        this.pending = false;
      });
  }

  onAddGroup() {
    this.openDialog('add').subscribe(async group => {
      if (group) {
        this.pending = true;
        await this.gs.addGroup(group);
        await this.gs.getGroups();
        const addedGroup = this.gs.getGroupByName(group.name);
        await this.ss.setStudentsGroup(addedGroup);
        this.pending = false;
      }
    });
  }

  onEditGroup(group: Group) {
    this.openDialog('edit', group).subscribe(async group => {
      if (group) {
        await this.ss.setStudentsGroup(group);
        await this.gs.updateGroup(group);
        this.getGroupsWithPending();
      }
    });
  }

  onDeleteGroup(id: string) {
    this.openDialog('delete').subscribe(async res => {
      if (res) {
        const group = await this.gs.getGroup(id);
        await this.ss.unsetStudentsGroup(group.studentIdList);
        await this.gs.deleteGroup(id);
        this.getGroupsWithPending();
      }
    });
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
        }).afterClosed();
    }
  }

  getGroupsWithPending() {
    this.pending = true;
    this.gs.getGroups();
  }

  ngOnDestroy() {
    this.groupsSub.unsubscribe();
  }
}
