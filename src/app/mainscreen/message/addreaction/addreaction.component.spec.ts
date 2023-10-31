import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreactionComponent } from './addreaction.component';

describe('AddreactionComponent', () => {
  let component: AddreactionComponent;
  let fixture: ComponentFixture<AddreactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddreactionComponent]
    });
    fixture = TestBed.createComponent(AddreactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
