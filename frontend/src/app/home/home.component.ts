import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@/models';

import { AuthenticationService, QuestService } from '@/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quests = [];
  currentUser: User;
  constructor(
    private authenticationService: AuthenticationService,
    private questService: QuestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUser;
    this.questService.getAll().subscribe((quests) => {
      this.quests = quests;
    });
  }

  onSignOut(): void {
    this.authenticationService.signOut().then((isSignOut) => {
      if (isSignOut) {
        this.router.navigate(['/']);
      }
    });
  }
}
