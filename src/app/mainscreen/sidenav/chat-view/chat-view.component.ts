import { Component, Input } from '@angular/core';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfilService } from 'src/services/user-profil.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent {

  user: User | undefined | null;

  constructor(
    private userFirebaseService: UserFirebaseService,
    private userProfilService: UserProfilService
  ) {

  }

  @Input() set uId(value: string) {
    console.log(value);
    this.user = null; // Reset user to null while loading

    // Use Promise<User> directly, as getUserByUID returns a Promise<User>
    this.userFirebaseService.getUserByUID(value)
      .then((loadedUser: User) => {
        this.user = loadedUser;
      })
      .catch((error) => {
        console.error('Error loading user:', error);
      });
  }

  async openUserProfil(user: User) {
    this.userProfilService.openUserProfil(user);
  }
}
