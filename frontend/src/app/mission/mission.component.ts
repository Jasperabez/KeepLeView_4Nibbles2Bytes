import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MissionService } from '@/services';

import { Mission } from '@/models';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss'],
})
export class MissionComponent implements OnInit {
  id: string;
  mission: Mission;
  constructor(
    private router: ActivatedRoute,
    private missionService: MissionService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = this.router.snapshot.params.id;
    this.mission = this.missionService.getById(this.id);
  }

  goBack(): void {
    this.location.back();
  }

  acceptMission(id: string): void {
    this.missionService.acceptMission(id);
  }
}
