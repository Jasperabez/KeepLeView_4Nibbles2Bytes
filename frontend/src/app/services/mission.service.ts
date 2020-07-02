import { Injectable } from '@angular/core';

import { mockMissions } from '@/helpers';

import { Mission } from '@/models';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  missions = [];

  constructor() {
    this.missions = mockMissions;
  }

  getById(id: string) {
    return this.missions.filter((mission) => mission.id === id)[0];
  }

  getAll() {
    return this.missions;
  }

  acceptMission(id: string) {
    this.missions.forEach((mission) => {
      if (mission.id === id) {
        mission.isTaken = true;
      }
    });
  }
}
