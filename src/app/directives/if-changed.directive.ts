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

  @Input() set appIfChanged(value: any) {
    const previousValue = this.ifChangedService.getPreviousValue();

    if (previousValue !== undefined && value !== previousValue) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    }

    this.ifChangedService.setPreviousValue(value);
  }

  @Input() set getLastTime(value: any) {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: value });
  }
}
