import { Injectable } from '@angular/core';

import { DB } from '../db';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private db: DB;

  constructor() {
    this.db = new DB();
  }

  addGroup(group: Group): Promise<any> {
    if (!group.studentIdList) {
      group.studentIdList = [];
    }
    group.name = group.name.trim();

    return this.db.groups.add(group);
  }

  updateGroup(group: Group): Promise<any> {
    if (!group.studentIdList) {
      group.studentIdList = [];
    }
    group.name = group.name.trim();

    return this.db.groups.put(group);
  }

  getGroup(name: string): Promise<Group> {
    return this.db.groups.get(name);
  }

  getGroups(): Promise<Group[]> {
    return this.db.groups.toArray();
  }

  deleteGroup(name: string): Promise<any> {
    return this.db.groups.delete(name);
  }

  async replaceStudent(prevGroupName: string, newGroupName: string, studentId: string) {
    const promiseArray = [];
    if (prevGroupName !== null) {
      const prevGroup = await this.getGroup(prevGroupName);
      prevGroup.studentIdList = prevGroup.studentIdList.filter((id => id !== studentId));
      promiseArray.push(this.db.groups.put(prevGroup));
    }

    if (newGroupName !== null) {
      const newGroup = await this.getGroup(newGroupName);
      newGroup.studentIdList.push(studentId);
      promiseArray.push(this.db.groups.put(newGroup));

    }

    return Promise.all(promiseArray);
  }

}