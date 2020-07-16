import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
})
export class PopupMessageComponent implements OnInit {
  @Input() messageType: string;
  @Output() done = new EventEmitter<void>();

  header: string;
  message: string;
  iconURL: string;

  constructor() {}

  ngOnInit(): void {
    this.setMessageByType(this.messageType);
  }

  setMessageByType(messageType: string): void {
    if (messageType === 'quest-complete') {
      this.questCompleteMessage();
    } else if (messageType === 'transaction-complete') {
      this.transactionCompleteMessage();
    }
  }

  questCompleteMessage(): void {
    this.header = 'Quest Complete!';
    this.message =
      'Your action matters and we appreciate what you did today. Thank you.';
    this.iconURL = '/assets/common/party.png';
  }

  transactionCompleteMessage(): void {
    this.header = 'Transaction Complete!';
    this.message = "You're halfway there, push through!";
    this.iconURL = '/assets/common/success.svg';
  }

  userDone(): void {
    this.done.emit();
  }
}
