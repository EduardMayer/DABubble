import { Injectable } from '@angular/core';

@Injectable()
export class IfChangedService {
  public previousValue: any;
  firstChange: boolean = true;

  setPreviousValue(value: any) {
    this.previousValue = value;
  }

  getPreviousValue(): any {
    return this.previousValue;
  }
}