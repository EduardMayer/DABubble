import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCreateComponent } from './message-edit.component';

describe('MessageCreateComponent', () => {
  let component: MessageCreateComponent;
  let fixture: ComponentFixture<MessageCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageCreateComponent]
    });
    fixture = TestBed.createComponent(MessageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
