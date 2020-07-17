import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() missionType: string;
  @Input() location: string;
  @Input() id: string;

  tagList: string[];

  imgURL: string;

  constructor() {
    this.tagList = [];
  }

  ngOnInit(): void {
    this.parseMissionType();
    this.parseId();
  }

  parseMissionType(): void {
    const allTagList = ['Donate', 'Deliver', 'Help'];

    allTagList.forEach((tag) => {
      if (this.missionType.search(tag) > -1) {
        this.tagList.push(tag);
      }
    });

    if (this.missionType.search('Deliver') > -1) {
      this.imgURL = '/assets/common/mover-truck.png';
    } else if (this.missionType.search('Donate') > -1) {
      this.imgURL = '/assets/common/heart.png';
    }
  }

  parseId(): void {
    this.id = this.id.substr(this.id.length - 5, this.id.length);
  }
}
