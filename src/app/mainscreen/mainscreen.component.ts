import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfilService } from 'src/services/user-profil.service';

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

  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public userFirebaseService: UserFirebaseService,
    private authService: AuthFirebaseService,
    public threadFirebaseService: ThreadFirebaseService,
    private UserProfilService: UserProfilService,
    public chatFirebaseService: ChatFirebaseService
  ) {
    
  }

  ngOnInit(): void {
    this.UserProfilService.openUserProfil$.subscribe((user: User) => {
      this.userProfilOpen = true;
      this.userProfilUser = user;
    });

    this.UserProfilService.closeUserProfil$.subscribe(() => {
      this.userProfilOpen = false;
    });

    setInterval(()=>{
      console.log(this.userFirebaseService.loadedUsers);
    },2000);

  }


  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }
}
