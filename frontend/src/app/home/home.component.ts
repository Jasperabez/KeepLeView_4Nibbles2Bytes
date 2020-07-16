import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Quest } from '@/models';

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
  questRouting: (arg0: Quest) => void;

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
          this.questRouting = this.gotoUserQuest;
        });
      } else {
        this.questService.getAll().subscribe((quests) => {
          this.quests = quests;
          this.isLoading = false;
          this.questRouting = this.gotoQuest;
        });
      }
    });
  }

  gotoQuest(quest: Quest) {
    this.router.navigate([`/quests/${quest.MissionId}`]);
  }

  gotoUserQuest(quest: Quest) {
    const missionType = quest.MissionType;
    const isCompleted = quest.IsCompleted;

    let type: string;
    let state: string;

    if (missionType.search('Deliver') > -1) {
      type = 'delivery';
    } else if (missionType.search('Donate') > -1) {
      type = 'collection';
    }

    if (isCompleted) {
      state = 'completed';
    } else {
      state = 'pending';
    }

    this.router.navigate([
      `/ongoing-quests/${type}/${state}/${quest.MissionId}`,
    ]);
  }

  onSignOut(): void {
    this.authService.signOut().then((isSignOut) => {
      if (isSignOut) {
        this.router.navigate(['/']);
      }
    });
  }
}
