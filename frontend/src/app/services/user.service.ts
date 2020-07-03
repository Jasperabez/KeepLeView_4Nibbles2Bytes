import { Injectable } from '@angular/core';

import { Auth } from 'aws-amplify';

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
}
