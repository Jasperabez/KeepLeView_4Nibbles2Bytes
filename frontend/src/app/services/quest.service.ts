import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quest } from '@/models';

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

  async getById(id: string) {
    const getByIdUrl = `${apiUrl}mission/${id}?formatting=detailed`;

    let quest = await this.http.get<Quest>(getByIdUrl).toPromise();
    quest = await quest[0];
    let user = await this.userService.getById(quest.BeneficiaryId).toPromise();
    user = await user[0];

    quest.lat = parseFloat(user.Latitude);
    quest.lng = parseFloat(user.Longtitude);

    return quest;
  }

  async getByVolunteerId(id: string) {
    const getByIdUrl = `${apiUrl}mission/${id}?formatting=detailed`;
    return await this.http.get<Quest[]>(getByIdUrl).toPromise();
  }

  getAll() {
    const getAllUrl = `${apiUrl}mission/allNotTaken`;
    return this.http.get<Quest[]>(getAllUrl);
  }

  acceptMission(missionId: string) {
    const acceptMissionUrl = `${apiUrl}mission/${missionId}`;

    return this.http.patch(acceptMissionUrl, {
      VolunteerId: this.authService.getId(),
      PatchType: 'AcceptMission',
    });
  }
}
