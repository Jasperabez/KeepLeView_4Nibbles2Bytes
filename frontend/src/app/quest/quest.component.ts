import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import {
  QuestService,
  AuthenticationService,
  LocationService,
} from '@/services';

import { Quest, Coords } from '@/models';

@Component({
  selector: 'app-mission',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
})
export class QuestComponent implements OnInit {
  questId: string;
  userId: string;
  quest: Quest;
  userLocation: Coords;
  isLoading = true;
  tagList: string[];
  constructor(
    private router: ActivatedRoute,
    private routing: Router,
    private questService: QuestService,
    private location: Location,
    private authService: AuthenticationService,
    private locationService: LocationService
  ) {
    this.tagList = [];
  }

  ngOnInit(): void {
    this.questId = this.router.snapshot.params.id;
    this.userId = this.authService.getId();
    this.questService.getById(this.questId).then((quest) => {
      quest.RequestUnixTime = quest.RequestUnixTime * 1000;
      this.quest = quest;
      this.parseMissionType();
      this.isLoading = false;
    });
    this.locationService.getPosition().then((location) => {
      this.userLocation = new Coords();
      this.userLocation.lat = location.coords.latitude;
      this.userLocation.lng = location.coords.longitude;
    });
  }

  parseMissionType(): void {
    const allTagList = ['Donate', 'Deliver', 'Help'];

    allTagList.forEach((tag) => {
      if (this.quest.MissionType.search(tag) > -1) {
        this.tagList.push(tag);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  acceptMission(id: string): void {
    this.isLoading = true;
    this.questService.acceptMission(id).subscribe((response) => {
      console.log(response);
      this.isLoading = false;
      this.routing.navigate(['/home/my-quest']);
    });
  }
}
