import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Chat } from 'src/models/chat.class';
import { User } from 'src/models/user.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})


export class SearchbarComponent implements OnInit {

  @Output() selectionEvent = new EventEmitter<string>();
  @ViewChild('searchField', { static: false }) searchField!: ElementRef;

  searchText: string = "";
  searchResults: string[] = [];
  searchResultsUsers: User[] = [];
  searchResultsChannels: Channel[] = [];



  constructor(
    private userService: UserFirebaseService,
    private channelService: ChannelFirebaseService,
    private chatService: ChatFirebaseService) { }

  headerControl = new FormControl('');
  options: { id: string; name: string, type: string, avatarSrc?: string }[] = [];
  filteredOptions$: Observable<{ id: string; name: string, type: string, avatarSrc?: string }[]> = new Observable();


  @Input() set types(value: string) {
    switch (value) {
      case "channels":
        this.options = this.getChannelsSearchArray('#');
        break;
      case "users":
        this.options = this.getUsersSearchArray('@');
        break;
      default:
        let usersArray = this.getUsersSearchArray('@');
        let channelsArray = this.getChannelsSearchArray('#');
        this.options = channelsArray.concat(usersArray);
    }
  }



  ngOnInit() {
    this.filteredOptions$ = this.headerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  getUsersSearchArray(prefix = '') {
    let usersByName: { id: string; name: string, type: string, avatarSrc: string }[] = [];
    this.userService.loadedUsers.forEach((user) => {
      usersByName.push({
        id: user.id,
        name: prefix + user.fullName,
        type: "user",
        avatarSrc: user.avatar
      });
    });
    return usersByName;
  }

  getChannelsSearchArray(prefix = '') {
    let channels: { id: string; name: string, type: string }[] = [];
    console.log(this.channelService.loadedChannels)
    this.channelService.loadedChannels.forEach((channel) => {
      channels.push({
        id: channel.id,
        name: prefix + channel.channelName,
        type: "channel"
      });
    });
    console.log(channels);
    return channels;

  }

  /*
  getAvatarScrOfUsername(username: string) {
    console.log(username);
    const user = this.userService.loadedUsers.find(user => user.fullName == username);
    console.log(user);
    if (user) {
      return user.avatar
    } else {
      return "assets/img/avatar/avatar0.svg";
    }
  }
  */

  private _filter(name: string | null) {
    if (name) {
      let filterValue = name.toLowerCase();
      let result = this.options.filter(option => option.name.toLowerCase().includes(filterValue));
      return result;
    } else {
      return [];
    }
  }


  selectOption(id: string) {
    this.openChatWithUserById(id);
    this.selectChannelById(id);
    this.searchField.nativeElement.value = "";
  }


  selectChannelById(id: string) {
    let channel = this.channelService.loadedChannels.find((channel) => id === channel.id);
    if (channel) {
      this.channelService.selectChannel(channel.id);
    }
  }


  getChatWithUserById(id: string) {
    return this.userService.loadedUsers.find((user) => (user.id === id));
  }

  openChatWithUserById(id: string) {
    let chatPartner = this.getChatWithUserById(id);
    if (chatPartner) {
      this.startChat(chatPartner.id);
    }
  }

  startChat(chatPartnerId: string) {
    const currentUser = this.userService.currentUser;
    const chatToSelect = this.chatService.loadedChats.find((chat) => (chat.users.includes(chatPartnerId) && chat.users.includes(currentUser.id)));

    if (chatToSelect) {
      this.chatService.selectChat(chatToSelect.id);
    } else {
      this.createChat(chatPartnerId, currentUser.id)
    }
  }


  /**
   * Initiates a new chat between the current user and a specified chat partner.
   *
   * @param {string} userId - The ID of the current user initiating the chat.
   * @param {string} chatPartnerId - The ID of the chat partner to start the chat with.

   * @throws {Error} If there is an issue updating the chat or opening the chat with the partner.
   */
  createChat(userId: string, chatPartnerId: string) {
    let chat = new Chat({
      users: [userId, chatPartnerId]
    });

    this.chatService.update(chat).then((chat) => {
      this.chatService.loadedChats.unshift(chat);
      this.startChat(chatPartnerId);
    }).catch((error) => {
      throw new Error(`Failed to start chat: ${error.message}`);
    });
  }















  testData: string[] = ["hallo", "Test", "Search"];

  sendData(event: Event) {
    if (this.searchText != "") {
      //console.log(this.searchText);
      this.searchResults = this.testData.filter(s => s.includes(this.searchText));
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
    console.log(this.userService.loadedUsers);

    this.userService.loadedUsers.forEach(user => {
      if (user.fullName.toUpperCase().includes(this.searchText.toUpperCase())) {
        this.searchResultsUsers.push(user);
        //this.options.push(user.fullName);
      }
    });


    /*
    this.userService.getUserForSearch(this.searchText)
        .then( (users) => {
          this.searchResultsUsers = users; 
        });
    */
  }
  getChannels() {
    this.searchResultsChannels = [];
    console.log("Loaded Channels:");
    console.log(this.channelService.loadedChannels);

    this.channelService.loadedChannels.forEach(channel => {
      if (channel.channelName.toUpperCase().includes(this.searchText.toUpperCase())) {
        this.searchResultsChannels.push(channel);
        //this.options.push(channel.channelName);
      }
    });
  }



  clickChannel(index: any) {
    this.channelService.selectChannel(this.searchResultsChannels[index].id);
  }



}
