import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { FormatService } from 'src/services/format.service';
import { IfChangedService } from 'src/services/if-changed-service.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss', '../../../../styles.scss', '../date-line/date-line.component.scss'],
  providers: [IfChangedService, MessageFirebaseService]
})
export class ThreadComponent implements OnDestroy {

  showEmojiList: boolean = false;
  showToolbar: boolean = false;
  answersPath: string = "";

  constructor(
    public channelService: ChannelFirebaseService,
    public threadService: ThreadFirebaseService,
    public userFirebase: UserFirebaseService,
    public formatService: FormatService) {}


  /**
  * Retrieves the path for answers associated with the current thread's message.
  *
  *  * @returns {string} - The path for answers associated with the current thread's message.
  */
  getAnswersPath(){
    return this.threadService.message?.path+"/answers/";
  }


  /**
  * Toggles the rendering of the emoji list.
  */
  toggleEmojiList() {
    this.showEmojiList = !this.showEmojiList;
  }


  /**
  * Closes the emoji list.
  */
  closeEmojiList() {
    this.showEmojiList = false;
  }


  /**
  * Handles the visibility of the emoji bar.
  * @param {boolean} isVisible - A boolean indicating whether the emoji list should be visible (`true`) or hidden (`false`).
  */
  handleEmojiBarVisibility(isVisible: boolean) {
    this.showEmojiList = isVisible;
  }

  
  /**
  * Opens the toolbar.
  * This method sets the showToolbar flag to true, indicating that the toolbar should be displayed.
  * @returns {void}
  */
  openToolbar() {
    this.showToolbar = true;
  }


  /**
  * Closes the toolbar.
  * This method sets the showToolbar flag to false, indicating that the toolbar should be hidden.
  *
  * @returns {void}
  */
  closeToolbar() {
    this.showToolbar = false;
  }

  
  /**
  * Closes the thread.
  * This method sets the message property in the threadService to undefined, indicating that there is no active thread.
  * @returns {void}
  */
  closeThread() {
    this.threadService.message = undefined;
  }


  /**
   * Closes current thread when componetn was destroyed (e.g. logout)
   */
  ngOnDestroy(): void {
    this.closeThread(); 
  }

}