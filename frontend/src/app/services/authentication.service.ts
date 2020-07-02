import { Injectable } from '@angular/core';

import { UserService } from '@/services';

import { User } from '@/models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser: User;

  constructor(private userService: UserService) {}

  login(username: string, password: string): boolean {
    if (this.userService.checkExist(username, password)) {
      this.currentUser = this.userService.get(username, password)[0];
      return true;
    } else {
      console.log('No such user or wrong password');
      return false;
    }
  }
}
