import { Component, ViewChild} from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { IfChangedService } from 'src/services/if-changed-service.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserProfileService } from 'src/services/user-profile.service';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { FormatService } from 'src/services/format.service';
import { WindowSizeService } from 'src/services/window-size.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  providers: [IfChangedService] // Provide the service at the component level
})
export class ChannelComponent{
  @ViewChild('menuTrigger') menuTrigger?: MatMenuTrigger;
  @ViewChild('addMemberTrigger') addMemberTrigger?: MatMenuTrigger;

  messageTime: string = "";
  messagePath: string = "";
  memberName: string = "";
  newAddedToChannelUser = new User();

  shouldOpenAddMemberMenu = false;

  hoverTitle = false;
  showEditChannel: boolean = false;
  showEditChannelUsers: boolean = false;
  showChannelUsers: boolean = false;

  windowWidth: any; 

  constructor(
    public channelService: ChannelFirebaseService,
    public chatService: ChatFirebaseService,
    public userService: UserFirebaseService,
    private userProfileService: UserProfileService,
    private activeSelectionService: ActiveSelectionService,
    private formatService: FormatService , 
    private windowSizeService: WindowSizeService
  ) {
    this.loadChannelMessages();
    this.windowSizeService.windowWidth$.subscribe(windowWidth => {
      this.windowWidth = windowWidth; 
    });
    this.windowSizeService.setWindowSize(); 
  }

  /**
   * Loads the conversation of the channel. 
   */
  loadChannelMessages() {
    let channel = this.activeSelectionService.getActiveSelectionObject();
    if (channel instanceof Channel) {
      this.channelService.loadChannelMessages(channel.id);// to be changed to currentChannel
      this.messagePath = `channels/${channel.id}/messages/`;
    }
  }


  /**
   * Closes pop up menu für add members dialog. 
   */
  closeMenus() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
    if (this.addMemberTrigger) {
      this.addMemberTrigger.closeMenu();
    }
  }


  /**
  * Closes pop up menu for channel members dialog. 
  */
  closeMenuViewUsersOnChannel() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
  }


  /**
  * Open add member dialog. 
  */
  openAddMemberMenu() {
    // Verzögerung hinzufügen
    
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
    if (this.addMemberTrigger) {
      this.addMemberTrigger.openMenu();
    }
  }


  /**
   * Closes edit channel dialog
   */
  closeEditDialog() {
    this.showEditChannel = false;
  }

  
  /**
  * Closes edit channel dialog
  */
  closeEditUsersDialog() {
    this.showEditChannelUsers = false;
  }


  /**
   * Closes show user dialog and opens edit channel users if option includes a defined string. 
   * @param option 
   */
  closeShowUsersDialog(option: string="") {
    if(option=='editChannelUser'){
      this.showEditChannelUsers = true;
    }
    this.showChannelUsers = false;
  }


  /**
   * Shows userprofile of given user. 
   * @param user - user for showing in profil
   */
  openProfil(user: User) {
    this.closeMenus()
    this.userProfileService.openUserProfil(user);
  }


  /**
   * Returns the time (in a formated form) of a given Message. 
   * @param message - message for that a Time is needed.
   * @returns - Time or string "heute" when it is today. 
   */
  getMessageTime(message: Message) {
    const currentDay = this.formatService.formatDateToDMY(new Date());
    const messageDmy = this.formatService.formatDateToDMY(new Date(message.timestamp));
    if (currentDay == messageDmy) {
      return "heute";
    } else {
      return messageDmy;
    }
  }


  /**
   * Closes edit channel user popup
   */
  closeEditChannelUsers() {
    this.showEditChannelUsers = false;
  }


  /**
   * Shorten a give string 
   * @param stringToShort - string to short
   * @returns - shortened string
   */
  getShortenedString( stringToShort: string) {
    return this.formatService.cutStrLen(stringToShort);
  }
}
