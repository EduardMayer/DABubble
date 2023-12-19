import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { IfChangedService } from 'src/services/if-changed-service.service';

@Directive({
  selector: '[appIfChanged]'
})
export class IfChangedDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private ifChangedService: IfChangedService
  ) { }


  /**
  * Updates the view in the Angular component if the value has changed since the last check.
  *
  * This function compares the current value with the previous value stored in the ifChangedService.
  * If the values are different, it clears the existing view and inserts a new embedded view.
  * Finally, it updates the previous value for future comparisons.
  *  
  * @param {*} value - The current value to check against the previous value.
  * @returns {void}
  */
  @Input() set appIfChanged(value: any) {
    const previousValue = this.ifChangedService.getPreviousValue();
    if (previousValue !== undefined && value !== previousValue) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    this.ifChangedService.setPreviousValue(value);
  }

  /**
  * Setter method for the `getLastTime` input property.
  *
  * This setter is triggered whenever the value of the `getLastTime` input property changes.
  * It clears the existing view in the Angular component's ViewContainer and inserts a new
  * embedded view using the provided templateRef with the specified value as the context.
  *
  * @param {*} value - The new value for the `getLastTime` input property.
  * @returns {void}
  * @example
  * // Usage in Angular component template:
  * // <app-example [getLastTime]="someValue"></app-example>
  */
  @Input() set getLastTime(value: any) {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: value });
  }
}
