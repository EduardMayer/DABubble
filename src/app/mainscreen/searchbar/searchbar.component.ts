import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, debounceTime, map, of, startWith, switchMap } from 'rxjs';
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
  @Output() updatedChannelModel = new EventEmitter<Channel>();
  @ViewChild('searchField', { static: false }) searchField!: ElementRef;

  //searchText: string = "";
  //searchResults: string[] = [];

  styleType: string = "header"

  channel: Channel | undefined;
  public channelUsers: User[] | undefined = [];

  private availableUsers: User[] = [];

  private _action: string | Channel = "";
  _type: string = "";

  constructor(
    private userService: UserFirebaseService,
    private channelService: ChannelFirebaseService,
    private chatService: ChatFirebaseService) { }

  headerControl = new FormControl('');
  options: { id: string; name: string, type: string, avatarSrc?: string }[] = [];

  private _filteredOptions$ = new BehaviorSubject<{ id: string; name: string; type: string; avatarSrc?: string | undefined; }[]>([]);
  filteredOptions$ = this._filteredOptions$.asObservable();

  ngOnInit() {
    this.filteredOptions$ = this.headerControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      switchMap(value => of(value)), // Adjust the debounce time as needed+
      map(value => this._filter(value))
    );
  }


  @Input() set types(value: string) {
    this._type = value;
      this.availableUsers = [...this.userService.loadedUsers];
      console.log("Available Users:");
      console.log(this.availableUsers);
    this.updateOptions();
  }

  @Input() set setStyle(value: string) {
    this.styleType = value;
  }


  @Input() set action(value: string | Channel) {
    if (value instanceof Channel) {
      console.log(value);
      this._action = "addUserToChannel";
      this.channel = value;
      this.getChannelUsers(value).then(users => {
        this.channelUsers = users;
      })
    } else {
      this._action = "openSelection";
    }
  }



  /**
  * Updates search-result options based on the current type.
  */
  private updateOptions() {
    switch (this._type) {
      case 'channels':
        this.options = this.getChannelsSearchArray('#');
        break;
      case 'users':
        this.options = this.getUsersSearchArray('@');
        break;
      default:
        let usersArray = this.getUsersSearchArray('@');
        let channelsArray = this.getChannelsSearchArray('#');
        this.options = channelsArray.concat(usersArray);
    }

    // Notify subscribers about the changes
    this._filteredOptions$.next(this.options);
  }


  /**
  * Asynchronously retrieves users associated with a given channel.
  * @param {Channel} channel - The channel for which users are to be retrieved.
  * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
  */
  async getChannelUsers(channel: Channel) {
    let channelUsers: User[] = [];
    await channel.users?.forEach(userId => {
      this.userService.getUserByUID(userId).then((user) => {
        channelUsers.push(user);
        this.unsetAvailableUser(user);
      });
    });
    return channelUsers;
  }


  get action(): string | Channel {
    return this._action;
  }





  /**
  * Retrieves an array of user objects for search, with optional name prefix.
  *
  * @param {string} [prefix=''] - The optional prefix to be added to each user's name.
  * @returns {Array<{ id: string; name: string, type: string, avatarSrc: string }>} An array of user objects for search.
  */
  getUsersSearchArray(prefix = '') {
    let usersByName: { id: string; name: string, type: string, avatarSrc: string }[] = [];
    this.availableUsers.forEach((user) => {
      usersByName.push({
        id: user.id,
        name: prefix + user.fullName,
        type: "user",
        avatarSrc: user.avatar
      });
    });
    return usersByName;
  }


  /**
  * Retrieves an array of channel objects for search, with optional name prefix.
  *
  * @param {string} [prefix=''] - The optional prefix to be added to each channels's name.
  * @returns {Array<{ id: string; name: string, type: string}>} An array of channel objects for search.
  */
  getChannelsSearchArray(prefix = '') {
    let channels: { id: string; name: string, type: string }[] = [];
    this.channelService.loadedChannels.forEach((channel) => {
      channels.push({
        id: channel.id,
        name: prefix + channel.channelName,
        type: "channel"
      });
    });
    return channels;
  }


  /**
  * Filters options based on a provided name.
  *
  * @param {string} name - The name to filter options.
  * @returns {Array<Object>} An array of filtered options.
  */
  private _filter(name: string | User | null) {
    if (typeof name === 'string') {
      let filterValue = name.toLowerCase();
      let result = this.options.filter(option => option.name.toLowerCase().includes(filterValue));
      return result;
    } else {
      return [];
    }
  }

  checkIfUserExistsInChannel(channel: Channel, uid: string) {
    let user = channel.users.find((channelUserId) => channelUserId === uid);
    if (user) {
      return true;
    } else {
      return false;
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
    console.log(this.userService.loadedUsers);
    console.log(id);
    return this.userService.loadedUsers.find((user) => (user.id === id));
  }


  openChatWithUserById(id: string) {
    console.log("openChatWithUserById" + id);
    let chatPartner = this.getChatWithUserById(id);
    if (chatPartner) {
      console.log("Starting Chat with" + chatPartner.id);
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

  add(userValues: { id: string; name: string, type: string, avatarSrc: string }) {
    this.userService.getUserByUID(userValues.id).then((user) => {
      if (this._action == 'addUserToChannel') {
        if (this.channel instanceof Channel) {
          if (!this.checkIfUserExistsInChannel(this.channel, user.id))
            this.searchField.nativeElement.value = "";
          this.unsetAvailableUser(user);
          this.setChannelUser(user);
        }
      } else if (this._action == 'openSelection') {
        this.selectOption(user.id);
        console.log("Selecting Option");
      }
    })


  }

  remove(user: User): void {
    if (this.channelUsers) {
      const index = this.channelUsers.indexOf(user);
      this.unsetChannelUser(user);
      this.setAvailabeUser(user);
    }
  }

  save() {
    let channelUserIds = this.getChannelUserIds();
    if (this.channel) {
      this.channel.users = channelUserIds;
      this.updatedChannelModel.emit(this.channel);
    }
  }

  getChannelUserIds() {
    let channelUserIds: string[] = [];
    if (this.channelUsers) {
      this.channelUsers.forEach((channelUser) => {
        channelUserIds.push(channelUser.id);
      });
    }
    return channelUserIds;
  }

  setAvailabeUser(user: User) {
    this.availableUsers.push(user);
    this.updateOptions();
  }

  unsetAvailableUser(user: User) {
    if (this.availableUsers.length > 0) {
      const index = this.availableUsers.indexOf(user);
      const deletedUser = this.availableUsers.splice(index, 1);
      console.log(deletedUser);
    }
    this.updateOptions();
    console.log(this.availableUsers);
  }

  setChannelUser(user: User) {
    this.channelUsers?.push(new User(user));
    this.updateOptions();
  }

  unsetChannelUser(user: User) {
    if (this.channelUsers) {
      const index = this.channelUsers.indexOf(user);
      this.channelUsers?.splice(index, 1);
      this.updateOptions();
    }


  }


}

