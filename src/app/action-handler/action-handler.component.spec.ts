import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionHandlerComponent } from './action-handler.component';

describe('ActionHandlerComponent', () => {
  let component: ActionHandlerComponent;
  let fixture: ComponentFixture<ActionHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionHandlerComponent]
    });
    fixture = TestBed.createComponent(ActionHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
