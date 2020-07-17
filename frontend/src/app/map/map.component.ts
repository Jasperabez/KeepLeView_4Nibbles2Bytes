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

  private mapLat: number;
  private mapLng: number;
  private mapZoom: number;

  private map: L.map;

  constructor() {}

  ngAfterViewInit(): void {
    this.calculateMapPosition();
    this.initMap();
    this.addDestinationMarker(this.lat, this.lng);
    this.addUserMarker(this.userLat, this.userLng);
  }

  private calculateMapPosition(): void {
    this.mapLat = (this.lat + this.userLat) / 2;
    this.mapLng = (this.lng + this.userLng) / 2;

    const distance = Math.sqrt(
      Math.pow(this.mapLat - this.lat, 2) + Math.pow(this.mapLng - this.lng, 2)
    );

    if (distance < 0.05) {
      this.mapZoom = 13;
    } else if (distance < 0.06) {
      this.mapZoom = 12;
    } else {
      this.mapZoom = 11;
    }
    console.log(distance);
    console.log(this.mapZoom);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.mapLat, this.mapLng],
      zoom: this.mapZoom,
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
