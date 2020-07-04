import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { QuestService } from '@/services';

import { Quest } from '@/models';

@Component({
  selector: 'app-mission',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
})
export class QuestComponent implements OnInit {
  id: string;
  quest: Quest;
  constructor(
    private router: ActivatedRoute,
    private questService: QuestService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = this.router.snapshot.params.id;
    this.quest = this.questService.getById(this.id);
  }

  goBack(): void {
    this.location.back();
  }

  acceptMission(id: string): void {
    this.questService.acceptMission(id);
  }
}
