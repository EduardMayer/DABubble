import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { Channel } from 'src/models/channel.class';
import { Chat } from 'src/models/chat.class';
import { User } from 'src/models/user.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { FormatService } from 'src/services/format.service';
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

  private hasRemoveAccess: boolean = false;
  private _action: string | Channel = "";
  public _type: string = "";

  styleType: string = "header"

  channel: Channel | undefined;

  public channelUsers: User[] = []; //All Users of the Channel
  public editableChannelUsers: User[] = []; //All Users that can be Removed in the current search element.
  private availableUsers: User[] = [];  // All Users that could be added to the Channel



  constructor(
    private userService: UserFirebaseService,
    private channelService: ChannelFirebaseService,
    private chatService: ChatFirebaseService,
    private formatService: FormatService) { }

  headerControl = new FormControl('');
  options: { id: string; name: string, type: string, avatarSrc?: string }[] = [];

  private _filteredOptions$ = new BehaviorSubject<{ id: string; name: string; type: string; avatarSrc?: string | undefined; }[]>([]);
  filteredOptions$ = this._filteredOptions$.asObservable();

  ngOnInit() {
    this.filteredOptions$ = this.headerControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map(value => this._filter(value))
    );
  }

  /**
   * Sets the search value type and initiates the search options.
   * @param {string} value - Type value ('channels' or 'users' or 'all').
   */
  @Input() set hasRemoveAccessInput(hasRemoveAccess: boolean) {
    this.hasRemoveAccess = hasRemoveAccess;
  }


  /**
   * Sets the search value type and initiates the search options that are depending on that type.
   * @param {string} value - Type value ('channels' or 'users' or 'all').
   */
  @Input() set types(value: string) {
    this._type = value;
    this.availableUsers = [...this.userService.loadedUsers];
    this.updateOptions();
  }


  /**
  * Sets the style type for the search bar.
  * @param {string} value - The style type value('header' or 'default').
  */
  @Input() set setStyle(value: string) {
    this.styleType = value;
  }


  /**
   * Sets the action type or channel instance for the search bar.
   * If a Channel instance is provided, it sets the action type to 'addUserToChannel'
   * and fetches associated users.
   * If a string is provided, it sets the action type to 'openSelection'.
   *
   * @param {string | Channel} value - The action type or channel instance.
   */
  @Input() set action(value: string | Channel) {
    if (value instanceof Channel) {
      this._action = "addUserToChannel";
      this.channel = value;
      this.getChannelUsers(value).then(users => {
        if (this.hasRemoveAccess) {
          this.editableChannelUsers = users;
        }
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

    if (this.options.length == 0) {
      this.options.push({
        id: "",
        name: "Keine Optionen verfügbar",
        type: ""
      });
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
        name: prefix + this.formatService.cutStrLen(user.fullName),
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
        name: prefix + this.formatService.cutStrLen(channel.channelName),
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


  /**
  * Checks if a user with the specified UID exists in the given channel.
  *
  * @param {Channel} channel - The channel to check for the user's existence.
  * @param {string} uid - The UID of the user to check.
  * @returns {boolean} - Returns true if the user exists in the channel, otherwise false.
  */
  checkIfUserExistsInChannel(channel: Channel, uid: string) {
    let user = channel.users.find((channelUserId) => channelUserId === uid);
    if (user) {
      return true;
    } else {
      return false;
    }
  }


  /**
 * Performs actions when a user or channel option is selected.
 *
 * 1. Opens a chat with the user identified by the provided ID.
 * 2. Selects the channel identified by the provided ID.
 * 3. Clears the search field value.
 *
 * @param {string} id - The ID of the selected user or channel.
 */
  selectOption(id: string) {
    this.searchField.nativeElement.value = "";
    this.openChatWithUserById(id);
    this.selectChannelById(id);
    this.headerControl.setValue("");
  }


  /**
  * Selects a channel based on the provided ID.
  * @param {string} id - The ID of the channel to be selected.
  */
  selectChannelById(id: string) {
    let channel = this.channelService.loadedChannels.find((channel) => id === channel.id);
    if (channel) {
      this.channelService.selectChannel(channel.id);
    }
  }


  /**
  * Retrieves user information based on the provided user ID.
  * @param {string} id - The ID of the user to retrieve information for.
  * @returns {User | undefined} - The user information if found, otherwise undefined.
  */
  getChatWithUserById(id: string) {
    return this.userService.loadedUsers.find((user) => (user.id === id));
  }


  /**
  * Opens a chat with the user identified by the provided user ID.
  * @param {string} id - The ID of the user to open a chat with.
  */
  openChatWithUserById(id: string) {
    let chatPartner = this.getChatWithUserById(id);
    if (chatPartner) {
      this.startChat(chatPartner.id);
    }
  }


  /**
  * Initiates a chat with the specified chat partner by either selecting an existing chat or creating a new one.
  * @param {string} chatPartnerId - The ID of the chat partner to start the chat with.
  */
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


  /**
  * Adds a user based on the provided user values, performing different actions based on the current action type.
  *
  * If the current action type is 'addUserToChannel':
  * - Checks if the user is not already in the channel.
  * - Clears the search field value if the user is added to the channel.
  * - Unset the user from the available users.
  * - Sets the user as part of the channel's users.
  *
  * If the current action type is 'openSelection':
  * - Selects the user option.
  *
  * @param {Object} userValues - User information including ID, name, type, and avatar source.
  */
  add(userValues: { id: string; name: string, type: string, avatarSrc: string }) {
    this.searchField.nativeElement.value = "";
    this.headerControl.setValue("");
    
    if(userValues.id!="")
    this.userService.getUserByUID(userValues.id).then((user) => {
      if (this._action == 'addUserToChannel' && this.channel instanceof Channel) {
        this.unsetAvailableUser(user);
        this.setChannelUser(user);
        this.save();
      } else if (this._action == 'openSelection') {
        this.selectOption(user.id);
      }
    })
  }


  /**
  * Removes a user from the channel users, unsetting the user from the channel and setting the user as available.
  *
  * @param {User} user - The user to be removed.
  */
  remove(user: User): void {
    if (this.channelUsers) {
      this.unsetChannelUser(user);
      this.setAvailableUser(user);

      this.save();
    }
  }


  /**
  * Saves the updated list of users for the current channel and emits the updated channel model.
  *
  * Retrieves the updated list of user IDs for the channel, updates the channel's users,
  * and emits the updated channel model using the 'updatedChannelModel' EventEmitter.
  *
  */
  save() {
    let channelUserIds = this.getChannelUserIds();
    if (this.channel) {
      this.channel.users = channelUserIds;
      this.updatedChannelModel.emit(this.channel);
    }
  }

  /**
  * Retrieves an array of user IDs from the current channel's users.
  *
  * @returns {string[]} - An array of user IDs for the current channel users, or an empty array if no channel users are available.
  */
  getChannelUserIds() {
    let channelUserIds: string[] = [];
    if (this.channelUsers) {
      this.channelUsers.forEach((channelUser) => {
        channelUserIds.push(channelUser.id);
      });
    }
    return channelUserIds;
  }


  /**
  * Adds a user to the list of available users and updates the search options.
  *
  * @param {User} user - The user to be added to the list of available users.
  */
  setAvailableUser(user: User) {
    this.availableUsers.push(user);
    this.updateOptions();
  }


  /**
  * Removes a user from the list of available users and updates the search options.
  * @param {User} user - The user to be removed from the list of available users.
  */
  unsetAvailableUser(user: User) {
    if (this.availableUsers.length > 0) {
      this.availableUsers = this.availableUsers.filter(avUser => avUser.id != user.id);
    }

    this.updateOptions();
  }


  /**
  * Adds a user to the list of channel users and updates the search options.
  * @param {User} user - The user to be added to the list of channel users.
  */
  setChannelUser(user: User) {
    let newUser: User = new User(user);
    this.channelUsers?.push(newUser);
    this.editableChannelUsers.push(newUser);
    this.updateOptions();
  }


  /**
  * Removes a user from the list of channel users and updates the search options. 
  * @param {User} user - The user to be removed from the list of channel users.
  */
  unsetChannelUser(user: User) {
    if (this.channelUsers) {
      this.channelUsers = this.channelUsers.filter(channUser => channUser != user);
      this.editableChannelUsers = this.editableChannelUsers.filter(channUser => channUser != user);
      this.updateOptions();
    }
  }

}

