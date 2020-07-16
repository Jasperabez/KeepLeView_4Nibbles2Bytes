import { Component, OnInit } from '@angular/core';

import { Item } from '@/models';

@Component({
  selector: 'app-popup-list',
  templateUrl: './popup-list.component.html',
  styleUrls: ['./popup-list.component.scss'],
})
export class PopupListComponent implements OnInit {
  items: Item[];

  constructor() {}

  ngOnInit(): void {
    this.items = [{ no: 1, name: 'Food', quantity: 5, measurement: 'kg' }];
  }

  addItem(
    name: HTMLInputElement,
    quantity: HTMLInputElement,
    measurement: HTMLInputElement
  ) {
    this.items.push({
      no: this.items.length + 1,
      name: name.value,
      quantity: parseInt(quantity.value, 10),
      measurement: measurement.value,
    });

    name.value = '';
    quantity.value = '';
    measurement.value = '';
  }
}
