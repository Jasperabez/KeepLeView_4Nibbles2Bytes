import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(
    private router: ActivatedRoute,
    private questService: QuestService,
    private location: Location,
    private authService: AuthenticationService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.questId = this.router.snapshot.params.id;
    this.userId = this.authService.getId();
    this.questService.getById(this.questId).then((quest) => {
      this.quest = quest;
      this.isLoading = false;
    });
    this.locationService.getPosition().then((location) => {
      this.userLocation = new Coords();
      this.userLocation.lat = location.coords.latitude;
      this.userLocation.lng = location.coords.longitude;
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
    });
  }

  completeMission(id: string): void {
    this.isLoading = true;
    this.questService.completeMission(id).subscribe((response) => {
      console.log(response);
      this.isLoading = false;
    });
  }
}
