import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import {
  QuestService,
  AuthenticationService,
  LocationService,
} from '@/services';

import { Quest, Coords } from '@/models';

@Component({
  selector: 'app-ongoing-quest',
  templateUrl: './ongoing-quest.component.html',
  styleUrls: ['./ongoing-quest.component.scss'],
})
export class OngoingQuestComponent implements OnInit {
  questId: string;
  userId: string;
  quest: Quest;
  userLocation: Coords;
  isLoading = true;
  messageType: string;

  isListHidden = true;
  isLogItem = false;

  isPopupHolder = false;
  isPopup = false;

  isActionButtonHidden = true;
  isLocationReachButtonHidden = true;
  isCompleteButtonHidden = true;

  type: string;
  state: string;

  tagList: string[];

  constructor(
    private router: ActivatedRoute,
    private questService: QuestService,
    private location: Location,
    private authService: AuthenticationService,
    private locationService: LocationService,
    private routing: Router
  ) {
    this.tagList = [];
  }

  ngOnInit(): void {
    this.questId = this.router.snapshot.params.id;

    this.checkState();

    this.userId = this.authService.getId();
    this.questService.getById(this.questId).then((quest) => {
      quest.RequestUnixTime = quest.RequestUnixTime * 1000;
      this.quest = quest;
      this.parseMissionType();
      this.isLoading = false;
    });
    this.locationService.getPosition().then((location) => {
      this.userLocation = new Coords();
      this.userLocation.lat = location.coords.latitude;
      this.userLocation.lng = location.coords.longitude;
    });
  }

  parseMissionType(): void {
    const allTagList = ['Donate', 'Deliver', 'Help'];

    allTagList.forEach((tag) => {
      if (this.quest.MissionType.search(tag) > -1) {
        this.tagList.push(tag);
      }
    });
  }

  checkState(): void {
    this.router.params.subscribe((route) => {
      this.type = route.type;
      this.state = route.state;

      if (this.type === 'delivery') {
        this.isLogItem = false;
      } else if (this.type === 'collection') {
        this.isLogItem = true;
      }

      if (this.state === 'pending') {
        this.isLocationReachButtonHidden = false;
        this.isActionButtonHidden = true;
        this.isCompleteButtonHidden = true;
      } else if (this.state === 'transaction') {
        this.isLocationReachButtonHidden = true;
        this.isActionButtonHidden = false;
        this.isCompleteButtonHidden = true;
      } else if (this.state === 'final') {
        this.isLocationReachButtonHidden = true;
        this.isActionButtonHidden = true;
        this.isCompleteButtonHidden = false;

        this.messageType = 'transaction-complete';

        this.isListHidden = true;
        this.isPopup = true;
        this.isPopupHolder = true;
      } else if (this.state === 'completed') {
        this.isLocationReachButtonHidden = true;
        this.isActionButtonHidden = true;
        this.isCompleteButtonHidden = false;

        this.messageType = 'quest-complete';

        this.isListHidden = true;
        this.isPopup = true;
        this.isPopupHolder = true;

        this.questService.getById(this.questId).then((quest) => {
          this.quest = quest;
          this.isLoading = false;
        });
      }
    });
  }

  goBack(): void {
    this.routing.navigate([`/home/my-quest`]);
  }

  hidePopupHolder(): void {
    this.isPopupHolder = false;
  }

  goToTransaction(): void {
    this.routing.navigate([
      `/ongoing-quests/${this.type}/transaction/${this.questId}`,
    ]);
  }

  startTransaction(): void {
    this.isListHidden = false;
    this.isPopupHolder = true;
  }

  goToFinal(): void {
    this.routing.navigate([
      `/ongoing-quests/${this.type}/final/${this.questId}`,
    ]);
  }

  completeMission(id: string): void {
    this.isLoading = true;
    this.questService.completeMission(id).subscribe((response) => {
      console.log(response);
      this.routing.navigate([
        `/ongoing-quests/${this.type}/completed/${this.questId}`,
      ]);
      this.isLoading = false;
    });
  }
}
