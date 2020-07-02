import { Injectable } from '@angular/core';

import { User } from '@/models';
import { mockUsers } from '@/helpers';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users = [];

  constructor() {
    this.users = mockUsers;
  }

  get(username: string, password: string) {
    return this.users.filter(
      (user) => user.username === username && user.password === password
    );
  }

  getAll() {
    return this.users;
  }

  register(user: User) {
    this.users.push(user);
  }

  delete(id: number) {
    this.users.filter((user) => user.id !== id);
  }

  checkExist(username: string, password: string) {
    return this.users.some(
      (user) => user.username === username && user.password === password
    );
  }
}
