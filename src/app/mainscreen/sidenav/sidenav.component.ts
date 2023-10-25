import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss', '../../../styles.scss']
})
export class SidenavComponent {

unpackChannels = false;
unpackMessages = false;


  showChannels() {

    if(this.unpackChannels == false) {
      this.unpackChannels = true;
    } else {
      this.unpackChannels = false;
    }
  }


  showMessages() {
    if(this.unpackMessages == false) {
      this.unpackMessages = true;
    } else {
      this.unpackMessages = false;
    }
  }
  }


