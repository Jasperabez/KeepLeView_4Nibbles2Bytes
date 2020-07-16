import { Injectable } from '@angular/core';

import { Coords } from '@/models';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  coords: Coords;

  constructor() {}

  getPosition(options?): Coords {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej, options);
    });
  }
}
