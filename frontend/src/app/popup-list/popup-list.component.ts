import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-list',
  templateUrl: './popup-list.component.html',
  styleUrls: ['./popup-list.component.scss'],
})
export class PopupListComponent implements OnInit {
  @Input() isLogItem = true;
  @Output() completed = new EventEmitter<void>();

  items = [
    { no: 1, name: 'White Rice', quantity: 5, measurement: 'kg' },
    { no: 2, name: 'Bread', quantity: 2, measurement: 'loaves' },
    { no: 3, name: 'Oatmeal', quantity: 2, measurement: 'bag' },
    { no: 4, name: 'Egg', quantity: 1, measurement: 'dozen' },
  ];

  title = 'Item list';
  itemButtonLabel = 'Tick';

  constructor() {}

  ngOnInit(): void {
    this.setListByIsLog();
  }

  setListByIsLog(): void {
    if (this.isLogItem) {
      this.setAsLogItem();
    }
  }

  setAsLogItem(): void {
    this.isLogItem = true;
    this.title = 'Log items';
    this.itemButtonLabel = 'Remove';
    this.items = [];
  }

  removeFromList(no: number): void {
    this.items = this.items.filter((item) => item.no !== no);
    this.updateListNo();

    if (!this.isLogItem && this.items.length === 0) {
      this.closeList();
    }
  }

  updateListNo(): void {
    let index = 1;
    this.items.forEach((item) => {
      item.no = index;
      index++;
    });
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

  closeList(): void {
    this.completed.emit();
  }
}
