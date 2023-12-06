import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyWindowComponent } from './empty-window.component';

describe('EmptyWindowComponent', () => {
  let component: EmptyWindowComponent;
  let fixture: ComponentFixture<EmptyWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyWindowComponent]
    });
    fixture = TestBed.createComponent(EmptyWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
