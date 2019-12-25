import { Injectable } from '@angular/core';

import uuid from 'uuid';

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
    group.id = uuid();
    group.name = group.name.trim();
    return this.db.groups.add(group);
  }

  updateGroup(group: Group): Promise<any> {
    group.name = group.name.trim();
    return this.db.groups.put(group);
  }

  getGroup(id: string): Promise<Group> {
    return this.db.groups.get(id);
  }

  getGroupByName(name: string): Promise<Group> {
    return this.db.groups
      .where('name')
      .equals(name)
      .first();
  }

  getGroups(): Promise<Group[]> {
    return this.db.groups.toArray();
  }

  deleteGroup(id: string): Promise<any> {
    return this.db.groups.delete(id);
  }

  async replaceStudent(prevGroupId: string, newGroupId: string, studentId: string) {
    const promiseArray = [];
    if (prevGroupId !== null) {
      const prevGroup = await this.getGroup(prevGroupId);
      prevGroup.studentIdList = prevGroup.studentIdList.filter((id => id !== studentId));
      promiseArray.push(this.db.groups.put(prevGroup));
    }

    if (newGroupId !== null) {
      const newGroup = await this.getGroup(newGroupId);
      newGroup.studentIdList.push(studentId);
      promiseArray.push(this.db.groups.put(newGroup));

    }

    return Promise.all(promiseArray);
  }

}