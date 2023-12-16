import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.class';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfileService } from 'src/services/user-profile.service';
import { WindowSizeService } from 'src/services/window-size.service';

@Component({
  selector: 'app-mainscreen',
  templateUrl: './mainscreen.component.html',
  styleUrls: ['./mainscreen.component.scss', '../../styles.scss']
})
export class MainscreenComponent implements OnInit {

  channelOpen = true;
  threadOpen = true;
  sideNavOpen = true;
  userProfilOpen = false;
  userProfilUser = new User();
  seclectedChannel: string = "";
  windowWidth: any; 
  showSidenavMobile: Boolean = true; 


  constructor(
    public channelService: ChannelFirebaseService,
    public userService: UserFirebaseService,
    public threadService: ThreadFirebaseService,
    private userProfileService: UserProfileService,
    public chatService: ChatFirebaseService, 
    private windowSizeService: WindowSizeService,
    public activeSelectionService: ActiveSelectionService
  ) {
  }

  ngOnInit(): void {
    this.userProfileService.openUserProfil$.subscribe((user: User) => {
      this.userProfilOpen = true;
      this.userProfilUser = user;
    });

    this.userProfileService.closeUserProfil$.subscribe(() => {
      this.userProfilOpen = false;
    });
    
    this.windowSizeService.windowWidth$.subscribe(windowWidth => {
      this.windowWidth = windowWidth; 
    });
    this.windowSizeService.setWindowSize(); 
  }

  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }

  newMessageMobile(){
    this.activeSelectionService.activeSelection = undefined; 
    this.showSidenavMobile = false; 
  }

}
