import { Component, ViewChild, Input } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { IfChangedService } from 'src/services/if-changed-service.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { MatMenuTrigger } from '@angular/material/menu';

import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { UserProfilService } from 'src/services/user-profil.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  providers: [IfChangedService] // Provide the service at the component level
})
export class ChannelComponent {
  @ViewChild('menuTrigger') menuTrigger?: MatMenuTrigger;
  @ViewChild('addMemberTrigger') addMemberTrigger?: MatMenuTrigger;

  messageTime: string = "";
  messagePath: string = "";
  memberName: string = "";
  newAddedToChannelUser = new User();

  hoverTitle = false;
  showEditChannel: boolean = false;
  channelCopy: Channel | undefined;

  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public userFirebaseService: UserFirebaseService,
    private userProfilService: UserProfilService
  ) {
    if (channelFirebaseService.selectedChannel) {
      channelFirebaseService.loadChannelMessages(channelFirebaseService.selectedChannel.id);// to be changed to currentChannel
      this.messagePath = `channels/${channelFirebaseService.selectedChannel.id}/messages/`;
    }
    //this.loadallChannelusers();

  }

  getMessageTime(message: Message) {
    const currentDay = this.formatDateToDmy(new Date());
    const messageDmy = this.formatDateToDmy(new Date(message.timestamp));
    if (currentDay == messageDmy) {
      return "heute";
    } else {
      return messageDmy;
    }
  }

  formatDateToDmy(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');      // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (add 1 because months are zero-based) and pad with leading zero if necessary
    const year = date.getFullYear();                              // Get year
    return `${day}.${month}.${year}`;
  }

  openChannelUserPopup() {

  }


  /*
  userOnCurrentChannel: User[] = [];

  loadallChannelusers() {
    this.userFirebaseService.loadedUsers.forEach(user => {

      const selectedChannelName = this.channelFirebaseService.selectedChannel?.channelName;

      if (selectedChannelName) {
        user.channels.forEach((channel, index) => {
          if (user.channels.includes(selectedChannelName)) {
            if (!this.userOnCurrentChannel.some((u: { fullName: string }) => u.fullName === user.fullName)) {
              this.userOnCurrentChannel.push(user);
            }
          }

          console.log('channel of the user is', channel);
          console.log('now selected channel is', this.channelFirebaseService.selectedChannel?.channelName);
        });
      }
    });
    console.log('all users for in chasnnechannel', this.userOnCurrentChannel);
  }
  */

  /*
  searchText: string = "";
  searchResults: string[] = [];
  searchResultsUsers: User[] = [];
  searchResultsChannels: Channel[] = [];

  testData: string[] = ["hallo", "Test", "Search"];
  */

  ngOnInit(): void {

  }


  /*
  sendData(event: Event) {

    console.log(this.searchText);

    if (this.searchText != "") {
      //console.log(this.searchText);
      //this.searchResults = this.testData.filter(s => s.includes(this.searchText)); 
      this.getUsers();
      this.getChannels();
    }
    else {
      this.searchResults = [];
      this.searchResultsUsers = [];
      this.searchResultsChannels = [];
    }
  }
  

  async getUsers() {

    this.searchResultsUsers = [];
    console.log("Loaded Users:");
    console.log(this.userFirebaseService.loadedUsers);

    this.userFirebaseService.loadedUsers.forEach(user => {
      if (user.fullName.toUpperCase().includes(this.searchText.toUpperCase())) {
        this.searchResultsUsers.push(user);
      }
    });

  }

  */

  /*
  getChannels() {


    this.searchResultsChannels = [];
    console.log("Loaded Channels:");
    console.log(this.channelFirebaseService.loadedChannels);

    this.channelFirebaseService.loadedChannels.forEach(channel => {
      if (channel.channelName.toUpperCase().includes(this.searchText.toUpperCase())) {
        this.searchResultsChannels.push(channel);
      }
    });

    this.userService.getChannelForSearch(this.searchText)
    .then( (channels) => {
      this.searchResultsChannels = channels; 
    });
    
  }
  */


  /*
  selectUserfromSearchings(resultUsers: any) {
    console.log(this.channelFirebaseService.selectedChannel);
    console.log("Send New Message to User with ID: ");
    console.log(this.searchResultsUsers[resultUsers]);



    if (this.channelFirebaseService.selectedChannel?.channelName) {

      this.newAddedToChannelUser = new User(resultUsers);

      //this.newAddedToChannelUser.channels.push(this.channelFirebaseService.selectedChannel.channelName);
      this.searchText = '';


    }

  }
  

  addUserToChannel(event: Event) {
    event.stopPropagation();
    const selectedChannelName = this.channelFirebaseService.selectedChannel?.channelName;

    if (selectedChannelName) {
      this.userFirebaseService.loadedUsers.forEach(user => {
        if (user.id == this.newAddedToChannelUser.id) {

          if (!user.channels.includes(selectedChannelName)) {
            //if(this.newAddedToChannelUser.fullName) {
            this.newAddedToChannelUser.channels.push(selectedChannelName);
            let newAddedToChannelUserToJson = this.newAddedToChannelUser.toJSON();

            this.userFirebaseService.update(this.newAddedToChannelUser);
            this.loadallChannelusers();
            this.newAddedToChannelUser.fullName = '';
            this.closeMenus();
            //}
          } else {
            alert('User ist schon enthalten')

          }

        }
      });
    }
  }
  */

  //!user.channels.includes(selectedChannelName)


  closeMenus() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
    if (this.addMemberTrigger) {
      this.addMemberTrigger.closeMenu();
    }
  }

  closeMenuViewUsersOnChannel() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }

  }

  shouldOpenAddMemberMenu = false;


  openAddMemberMenu() {
    // Verzögerung hinzufügen
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
    if (this.addMemberTrigger) {
      this.addMemberTrigger.openMenu();
    }

  }

  cancelSelection() {
    this.newAddedToChannelUser.fullName = '';

  }

  /*
  clickChannel(index: any) {
    this.channelFirebaseService.selectChannel(this.searchResultsChannels[index].id);
  }
  */

  closeEditDialog() {
    this.showEditChannel = false;
  }

  openProfil(user: User) {
    this.closeMenus()
    this.userProfilService.openUserProfil(user);
  }

  handleChannelUserUpdate(newChannel: Channel) {
    this.channelCopy = newChannel;
  }

  saveUserChanges() {
    if (this.channelCopy) {
      debugger;
      this.channelFirebaseService.selectedChannel = this.channelCopy;
      this.channelFirebaseService.updateChannel(this.channelCopy);
      this.channelFirebaseService.loadallChannelusers();
    }
  }

}
