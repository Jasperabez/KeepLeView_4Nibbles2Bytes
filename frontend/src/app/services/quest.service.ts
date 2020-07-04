import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { mockQuests } from '@/helpers';
import { Quest } from '@/models';

const apiUrl = 'https://1bdbj7hjli.execute-api.us-east-1.amazonaws.com/dev/';
=======

import { mockQuests } from '@/helpers';
>>>>>>> Added more UI

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  quests = [];

<<<<<<< HEAD
  constructor(private http: HttpClient) {
=======
  constructor() {
>>>>>>> Added more UI
    this.quests = mockQuests;
  }

  getById(id: string) {
<<<<<<< HEAD
    const getByIdUrl = `${apiUrl}mission/${id}?formatting=detailed`;
    return this.http.get<Quest>(getByIdUrl);
  }

  getAll() {
    const getAllUrl = apiUrl + 'mission/allNotTaken';
    return this.http.get<Quest[]>(getAllUrl);
=======
    return this.quests.filter((quest) => quest.id === id)[0];
  }

  getAll() {
    return this.quests;
>>>>>>> Added more UI
  }

  acceptMission(id: string) {
    this.quests.forEach((quest) => {
      if (quest.id === id) {
        quest.isTaken = true;
      }
    });
  }
}
