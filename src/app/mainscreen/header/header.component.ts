import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserProfilService } from 'src/services/user-profil.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../../styles.scss']
})
export class HeaderComponent implements OnInit {

  user: any = new User();

  showHeaderMenu = false;

  constructor(
    private userProfilService: UserProfilService,
    private authService: AuthFirebaseService,
    public userService: UserFirebaseService,
    public channelService: ChannelFirebaseService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUserByUID(JSON.parse(localStorage.getItem('user')!).uid);
  }

  /**
   * loggout the current user. 
   */
  logout() {
    this.showHeaderMenu = false;
    this.authService.logout();
    //this.router.navigate(['']);
  }

  /**
   * Show or hide menu. 
   */
  toogleHeaderMenu() {
    this.showHeaderMenu = !this.showHeaderMenu;
  }

  /**
   * show or hide userprofil
   */
  showProfil() {
    this.showHeaderMenu = false;
    this.userProfilService.openUserProfil(this.userService.currentUser);
  }
}
