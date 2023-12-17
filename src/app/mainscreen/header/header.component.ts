import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/models/user.class';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from 'src/services/user-profile.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { WindowSizeService } from 'src/services/window-size.service';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { FormatService } from 'src/services/format.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../../styles.scss']
})
export class HeaderComponent implements OnInit {

  user: any = new User();

  showHeaderMenu = false;
  @Input() channelSelected = false; 
  @Input() chatSelected = false; 
  @Input() emptyChatSelectedMobile = false; 

  @Output() closeEmptyViewEvent = new EventEmitter<any>();

  windowWidth: number = 1024;  

  constructor(
    public userService: UserFirebaseService,
    public channelService: ChannelFirebaseService,
    private userProfileService: UserProfileService,
    private authService: AuthFirebaseService,
    private chatService: ChatFirebaseService, 
    private windowSizeService: WindowSizeService,
    private activeSelectionService: ActiveSelectionService,
    private formatService: FormatService,
    private router: Router) { }

  /**
   * Loads current user from firebase 
   */
  async ngOnInit(): Promise<void> {    
    this.user = await this.userService.getUserByUID(JSON.parse(localStorage.getItem('user')!).uid);
    this.windowSizeService.windowWidth$.subscribe(windowWidth => {
      this.windowWidth = windowWidth; 
    });
    this.windowSizeService.setWindowSize(); 
  }


  /**
   * loggout the current user. 
   */
  logout() {
    this.showHeaderMenu = false;
    this.authService.logout();
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
    this.userProfileService.openUserProfil(this.userService.currentUser);
  }


  /**
   * close Chat and Channel view in mobile View
   */
  closeChatOrChannel(){
    this.channelService.selectedChannelId = undefined; 
    this.chatService.selectedChatId = undefined;   
    this.activeSelectionService.activeSelection = undefined; 
    this.closeEmptyViewEvent.emit();
  }


  /**
   * Close profil menu popup
   */
  closeProfilePopup(){
    if(this.showHeaderMenu){
      this.showHeaderMenu = false;
    }
  }

  /**
   * Shorten a give string 
   * @param stringToShort - string to short
   * @returns - shortened string
   */
  getShortenedString( stringToShort: string) {
    return this.formatService.cutStrLen(stringToShort);
  }


  /**
   * Prevents closing of popup when click inside of popup
   * @param event - clickevent 
   */
  stopPropagation(event:Event){
    event.stopPropagation();
  }
}
