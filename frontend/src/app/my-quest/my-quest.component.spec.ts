import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuestComponent } from './my-quest.component';

describe('MyQuestComponent', () => {
  let component: MyQuestComponent;
  let fixture: ComponentFixture<MyQuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
