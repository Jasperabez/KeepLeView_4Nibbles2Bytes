import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingQuestComponent } from './ongoing-quest.component';

describe('OngoingQuestComponent', () => {
  let component: OngoingQuestComponent;
  let fixture: ComponentFixture<OngoingQuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingQuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
