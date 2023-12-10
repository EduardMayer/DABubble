import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChannelUsersComponent } from './show-channel-users.component';

describe('ShowChannelUsersComponent', () => {
  let component: ShowChannelUsersComponent;
  let fixture: ComponentFixture<ShowChannelUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowChannelUsersComponent]
    });
    fixture = TestBed.createComponent(ShowChannelUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
