import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent {

  @Output() closeImprintView = new EventEmitter<void>();



  closeImprint(){
    this.closeImprintView.emit(); 
  }


}
