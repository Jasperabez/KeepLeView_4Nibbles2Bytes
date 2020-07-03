import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@/models';

import { AuthenticationService, MissionService } from '@/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  missions = [];
  currentUser: User;
  constructor(
    private authenticationService: AuthenticationService,
    private missionService: MissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUser;
    this.missions = this.missionService.getAll();
  }

  onSignOut(): void {
    this.authenticationService.signOut().then((isSignOut) => {
      if (isSignOut) {
        this.router.navigate(['/']);
      }
    });
  }
}
