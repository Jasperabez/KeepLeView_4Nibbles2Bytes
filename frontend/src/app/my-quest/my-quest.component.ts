import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, QuestService } from '@/services';

@Component({
  selector: 'app-my-quest',
  templateUrl: './my-quest.component.html',
  styleUrls: ['./my-quest.component.scss'],
})
export class MyQuestComponent implements OnInit {
  quests = [];
  myId: string;
  constructor(
    private authenticationService: AuthenticationService,
    private questService: QuestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.myId = this.authenticationService.getId();
    this.questService.getByVolunteerId(this.myId).then((quests) => {
      this.quests = quests;
    });
  }
}
