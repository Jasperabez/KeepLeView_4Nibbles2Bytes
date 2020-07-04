import { Injectable } from '@angular/core';

import { mockQuests } from '@/helpers';

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  quests = [];

  constructor() {
    this.quests = mockQuests;
  }

  getById(id: string) {
    return this.quests.filter((quest) => quest.id === id)[0];
  }

  getAll() {
    return this.quests;
  }

  acceptMission(id: string) {
    this.quests.forEach((quest) => {
      if (quest.id === id) {
        quest.isTaken = true;
      }
    });
  }
}
