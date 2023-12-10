import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChannelUsersComponent } from './edit-channel-users.component';

describe('EditChannelUsersComponent', () => {
  let component: EditChannelUsersComponent;
  let fixture: ComponentFixture<EditChannelUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditChannelUsersComponent]
    });
    fixture = TestBed.createComponent(EditChannelUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
