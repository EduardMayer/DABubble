import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Chat } from 'src/models/chat.class';
import { User } from 'src/models/user.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})


export class SearchbarComponent implements OnInit {

  @Output() selectionEvent = new EventEmitter<string>();

  searchText: string = "";
  searchResults: string[] = [];
  searchResultsUsers: User[] = [];
  searchResultsChannels: Channel[] = [];

  constructor(
    private userService: UserFirebaseService,
    private channelService: ChannelFirebaseService,
    private chatService: ChatFirebaseService) { }

  headerControl = new FormControl('');
  options: string[] = [];
  filteredOptions$: Observable<string[]> = new Observable();


  ngOnInit() {
    let usersString = this.getUsersAsStringArray('@');
    let channelsString = this.getChannelsAsStringArray('#');
    this.options = channelsString.concat(usersString);

    this.filteredOptions$ = this.headerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  getUsersAsStringArray(prefix = '') {
    let usersByName: string[] = [];
    this.userService.loadedUsers.forEach((user) => {
      usersByName.push(prefix + user.fullName);
    });
    return usersByName;
  }

  getChannelsAsStringArray(prefix = '') {
    let channelsByName: string[] = [];
    this.channelService.loadedChannels.forEach((channel) => {
      channelsByName.push(prefix + channel.channelName);
    });
    return channelsByName;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  selectOption(name: string) {
    let atIndex = name.indexOf('@');
    if (atIndex !== -1) {
      name = name.slice(0, atIndex) + name.slice(atIndex + 1);
      this.openChatWithUserByName(name);
    }

    atIndex = name.indexOf('#');
    if (atIndex !== -1) {
      name = name.slice(0, atIndex) + name.slice(atIndex + 1);
      this.selectChannelByName(name);
    }
  }

  selectChannelByName(name: string) {
    let channel = this.channelService.loadedChannels.find((channel) => name === channel.channelName);
    if (channel) {
      this.channelService.selectChannel(channel.id);
    } else {
      console.warn("No Channel found");
    }
  }

  openChatWithUserByName(name: string) {
    const currentUser = this.userService.currentUser;
    var chatPartner = this.userService.loadedUsers.find((user) => (user.fullName === name));
    if (chatPartner) {
      var chatPartnerId=chatPartner.id;
    }

    if (chatPartner?.id) {
      const chatToSelect = this.chatService.loadedChats.find((chat) => (chat.users.includes(chatPartnerId) && chat.users.includes(currentUser.id)));



      if (chatToSelect) {
        this.chatService.selectChat(chatToSelect.id);
      } else {
        let chat = new Chat({
          users: [chatPartner?.id, currentUser.id]
        });

        this.chatService.update(chat).then(() => {
          this.chatService.selectChat(chat.id)
        });

      }
    }

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
        this.options.push(user.fullName);
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
        this.options.push(channel.channelName);
      }
    });
  }



  clickChannel(index: any) {
    this.channelService.selectChannel(this.searchResultsChannels[index].id);
  }



}
