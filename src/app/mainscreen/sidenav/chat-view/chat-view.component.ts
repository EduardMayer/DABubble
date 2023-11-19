import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfilService } from 'src/services/user-profil.service';
import { UserStatusFirebaseService } from 'src/services/user-status-firebase.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit{

  user: User | undefined | null;

  constructor(
    private userFirebaseService: UserFirebaseService,
    private userProfilService: UserProfilService, 
    private userStatusService: UserStatusFirebaseService
  ) {

  }

  @Input() set uId(value: string) {
    console.log(value);
    this.user = null; // Reset user to null while loading

    // Use Promise<User> directly, as getUserByUID returns a Promise<User>
    this.userFirebaseService.getUserByUID(value)
      .then((loadedUser: User) => {
        this.user = loadedUser;
        //Get Userstatus
        this.userStatusService.getUserStatus(value)
        .then((result) => {
          this.user!.status = result;
        })
        .catch((error) => {
          console.log(error);
        });
      })
      .catch((error) => {
        console.error('Error loading user:', error);
      });
   
  }

  ngOnInit(): void {
    
  }

  async openUserProfil(user: User) {
    this.userProfilService.openUserProfil(user);
  }
}
