import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent {

  @Output() closeImprintView = new EventEmitter<void>();

  /**
 * Emits an event to signal the closing of the imprint view.
 * 
 * @emits closeImprintView
 * @returns {void}
 */
closeImprint() {
  this.closeImprintView.emit();
}

}
