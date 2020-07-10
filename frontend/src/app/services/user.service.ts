import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Beneficiary } from '@/models';

const apiUrl = 'https://1bdbj7hjli.execute-api.us-east-1.amazonaws.com/dev/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getById(id: string) {
    const getByIdUrl = `${apiUrl}beneficiary/${id}`;
    return this.http.get<Beneficiary>(getByIdUrl);
  }
}
