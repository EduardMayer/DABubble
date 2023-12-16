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

  getMessageTimeString(message: Message) {
    const currentDay = this.formatService.formatDateToDMY(new Date());
    const messageDmy = this.formatService.formatDateToDMY(new Date(message.timestamp));
    if (currentDay == messageDmy) {
      return "heute";
    } else {
      return messageDmy;
    }
  }

  getAnswersPath(){
    return this.threadService.message?.path+"/answers/";
  }

  toggleEmojiList() {
    this.showEmojiList = !this.showEmojiList;
  }

  closeEmojiList() {
    this.showEmojiList = false;
  }

  handleEmojiBarVisibility(isVisible: boolean) {
    this.showEmojiList = isVisible;
  }

  openToolbar() {
    this.showToolbar = true;
  }

  closeToolbar() {
    this.showToolbar = false;
  }

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