import { Component, OnInit } from '@angular/core';
import { User } from '@/models';

import { AuthenticationService, UserService, MissionService } from '@/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  users = [];
  missions = [];
  currentUser: User;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private missionService: MissionService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUser;
    this.users = this.userService.getAll();
    this.missions = this.missionService.getAll();
  }
}
