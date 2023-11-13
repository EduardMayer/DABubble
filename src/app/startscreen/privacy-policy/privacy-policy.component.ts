import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  @Output() closePrivacyPolicyView = new EventEmitter<void>();



  /**
 * Emits an event to signal the closing of the privacy policy view.
 * 
 * @emits closePrivacyPolicyView
 * @returns {void}
 */
closePrivacyPolicy() {
  this.closePrivacyPolicyView.emit();
}


}
