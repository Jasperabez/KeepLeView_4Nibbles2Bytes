import { Injectable } from '@angular/core';

import { Auth } from 'aws-amplify';

import { User } from '@/models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUser;
  // id: string;
  id = 'd823b0ff-0b2b-4bbf-9c93-3ec7826657de';

  constructor() {}

  getId(): string {
    return 'V-' + this.id;
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      this.currentUser = await Auth.signIn(username, password);
      this.id = this.currentUser.pool.clientId;
      return true;
    } catch (error) {
      console.log('error signing in', error);
      return false;
    }
  }

  async register(user: User) {
    try {
      const registerStatus = await Auth.signUp({
        username: user.username,
        password: user.password,
        attributes: {
          given_name: user.firstName,
          family_name: user.lastName,
        },
      });
      console.log(registerStatus);
    } catch (error) {
      console.log('error signing up', error);
    }
  }

  async signOut(): Promise<boolean> {
    try {
      await Auth.signOut();
      this.currentUser = null;
      return true;
    } catch (error) {
      console.log('error signing out: ', error);
      return false;
    }
  }
}
