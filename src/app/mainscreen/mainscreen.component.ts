import { Component } from '@angular/core';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss' , '../../styles.scss']
})
export class MainscreenComponent {

  channelOpen = true;
  threadOpen = true; 
  sideNavOpen = true; 


  /*

  EXAMPLE VALUES
  messageRef: string = "aSyrPGGxzgTZMjZxjJVB";
  messageRef2: string= "EO7EJSfbToZGXF7YL4cZ";
  */


  toggleSideNav(){
    this.sideNavOpen = !this.sideNavOpen; 
  }


}
