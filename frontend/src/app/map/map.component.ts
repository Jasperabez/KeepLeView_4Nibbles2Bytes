import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @Input() lat = 1.359375;
  @Input() lng = 1.359375;
  @Input() userLat: number;
  @Input() userLng: number;

  private map: L.map;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.addDestinationMarker(this.lat, this.lng);
    this.addUserMarker(this.userLat, this.userLng);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: 15,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  private addDestinationMarker(lat: number, lng: number): void {
    const icon = {
      icon: L.icon({
        iconSize: [30, 30],
        iconAnchor: [15, 0],
        // specify the path here
        iconUrl: 'assets/common/marker.webp',
      }),
    };

    L.marker([lat, lng], icon).addTo(this.map);
  }

  private addUserMarker(lat: number, lng: number): void {
    const icon = {
      icon: L.icon({
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        // specify the path here
        iconUrl: 'assets/common/user_marker.png',
      }),
    };

    L.marker([lat, lng], icon).addTo(this.map);
  }
}
