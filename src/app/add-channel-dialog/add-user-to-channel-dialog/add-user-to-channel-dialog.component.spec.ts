import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToChannelDialogComponent } from './add-user-to-channel-dialog.component';

describe('AddUserToChannelDialogComponent', () => {
  let component: AddUserToChannelDialogComponent;
  let fixture: ComponentFixture<AddUserToChannelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUserToChannelDialogComponent]
    });
    fixture = TestBed.createComponent(AddUserToChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
