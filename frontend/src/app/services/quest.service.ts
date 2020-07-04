import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { mockQuests } from '@/helpers';
import { Quest } from '@/models';

const apiUrl = 'https://1bdbj7hjli.execute-api.us-east-1.amazonaws.com/dev/';

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  quests = [];

  constructor(private http: HttpClient) {
    this.quests = mockQuests;
  }

  getById(id: string) {
    const getByIdUrl = `${apiUrl}mission/${id}?formatting=detailed`;
    return this.http.get<Quest>(getByIdUrl);
  }

  getAll() {
    const getAllUrl = apiUrl + 'mission/allNotTaken';
    return this.http.get<Quest[]>(getAllUrl);
  }

  acceptMission(id: string) {
    this.quests.forEach((quest) => {
      if (quest.id === id) {
        quest.isTaken = true;
      }
    });
  }
}
