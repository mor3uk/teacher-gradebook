import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

import uuid from 'uuid';

import { DB } from '../db';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private db: DB;
  private groups: Group[] = [];

  groupsChanged = new Subject<Group[]>();
  groupsLoaded = new BehaviorSubject<boolean>(false);
  newGroupToAdd = new Subject();
  newGroupCreated = new Subject<Group>();

  constructor() {
    this.db = new DB();
    this.getGroups().then(() => {
      this.groupsLoaded.next(true);
    });
  }

  addGroup(group: Group): Promise<any> {
    group.id = uuid();
    group.name = group.name.trim();
    return this.db.groups.add(group);
  }

  updateGroup(group: Group): Promise<Group> {
    group.name = group.name.trim();
    return this.db.groups.put(group).then(() => group);
  }

  getGroup(id: string): Group {
    return this.groups.find(group => group.id === id);
  }

  getGroupByName(name: string): Group {
    return this.groups.find(group => group.name === name);
  }

  getGroups(): Promise<void> {
    return this.db.groups.toArray().then(groups => {
      this.groups = groups;
      this.groupsChanged.next([...this.groups]);
    });
  }

  getGroupsWithStudents(): Group[] {
    return this.groups.filter(
      group => group.studentIdList && group.studentIdList.length !== 0
    );
  }

  deleteGroup(id: string): Promise<Group> {
    const group = this.getGroup(id);
    return this.db.groups.delete(id).then(() => group);
  }

  replaceStudent(prevGroupId: string, newGroupId: string, studentId: string): Promise<any> {
    const promiseArray = [];
    if (prevGroupId !== null) {
      const prevGroup = this.getGroup(prevGroupId);
      prevGroup.studentIdList = prevGroup.studentIdList.filter((id => id !== studentId));
      promiseArray.push(this.db.groups.put(prevGroup));
    }

    if (newGroupId !== null) {
      const newGroup = this.getGroup(newGroupId);
      newGroup.studentIdList.push(studentId);
      promiseArray.push(this.db.groups.put(newGroup));

    }

    return Promise.all(promiseArray);
  }

}
