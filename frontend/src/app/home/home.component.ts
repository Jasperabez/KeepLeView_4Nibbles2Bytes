import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '@/models';

import { AuthenticationService, QuestService } from '@/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quests = [];
  userId: string;

  isLoading: boolean;
  questRouting: string;

  constructor(
    private authService: AuthenticationService,
    private questService: QuestService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getId();
    this.getQuestsByActivatedRoute();
  }

  public getQuestsByActivatedRoute() {
    this.activatedRoute.params.subscribe((route) => {
      this.isLoading = true;
      if (route.state === 'my-quest') {
        this.questService.getByVolunteerId(this.userId).then((quests) => {
          this.quests = quests;
          this.isLoading = false;
          this.questRouting = '/ongoing-quests/';
        });
      } else {
        this.questService.getAll().subscribe((quests) => {
          this.quests = quests;
          this.isLoading = false;
          this.questRouting = '/quests/';
        });
      }
    });
  }

  onSignOut(): void {
    this.authService.signOut().then((isSignOut) => {
      if (isSignOut) {
        this.router.navigate(['/']);
      }
    });
  }
}
