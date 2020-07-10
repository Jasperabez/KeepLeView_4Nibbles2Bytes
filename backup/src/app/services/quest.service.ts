import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quest, Beneficiary } from '@/models';

import { AuthenticationService, UserService } from '@/services';

const apiUrl = 'https://1bdbj7hjli.execute-api.us-east-1.amazonaws.com/dev/';

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private userService: UserService
  ) {}

<<<<<<< HEAD
<<<<<<< HEAD
  constructor(private http: HttpClient) {
=======
  constructor() {
>>>>>>> Added more UI
    this.quests = mockQuests;
  }

  getById(id: string) {
<<<<<<< HEAD
=======
  async getById(id: string) {
>>>>>>> Added Beneficiary service
    const getByIdUrl = `${apiUrl}mission/${id}?formatting=detailed`;

    let quest = await this.http.get<Quest>(getByIdUrl).toPromise();
    quest = await quest[0];
    let user = await this.userService.getById(quest.BeneficiaryId).toPromise();
    user = await user[0];

    quest.lat = parseFloat(user.Latitude);
    quest.lng = parseFloat(user.Longtitude);

    return quest;
  }

  getAll() {
    const getAllUrl = `${apiUrl}mission/allNotTaken`;
    return this.http.get<Quest[]>(getAllUrl);
=======
    return this.quests.filter((quest) => quest.id === id)[0];
  }

  getAll() {
    return this.quests;
>>>>>>> Added more UI
  }

  acceptMission(missionId: string) {
    const acceptMissionUrl = `${apiUrl}mission/${missionId}`;

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: {
        VolunteerId: this.authService.getId(),
        PatchType: 'AcceptMission',
      },
    };

    const header = {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    };

    console.log(this.authService.getId());

    const body = {
      VolunteerId: this.authService.getId(),
      PatchType: 'AcceptMission',
    };

    return this.http.patch(acceptMissionUrl, {
      VolunteerId: this.authService.getId(),
      PatchType: 'AcceptMission',
    });
  }
}
