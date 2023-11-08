import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMessageComponent } from './message-edit.component';

describe('EditMessageComponent', () => {
  let component: EditMessageComponent;
  let fixture: ComponentFixture<EditMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMessageComponent]
    });
    fixture = TestBed.createComponent(EditMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
