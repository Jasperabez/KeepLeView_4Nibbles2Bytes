import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() missionType: string;
  @Input() time;
  @Input() location: string;

  tagList: string[];

  constructor() {
    this.tagList = [];
  }

  ngOnInit(): void {
    const allTagList = ['Donate', 'Deliver', 'Help'];

    allTagList.forEach((tag) => {
      if (this.missionType.search(tag) > -1) {
        this.tagList.push(tag);
      }
    });
  }
}
