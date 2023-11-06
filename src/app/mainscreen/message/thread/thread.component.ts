import { Component, Input } from '@angular/core';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
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
export class ThreadComponent {

  showEmojiList: boolean = false;
  showToolbar: boolean = false;
  answersPath: string = "";

  constructor(
    public messageFirebaseService: MessageFirebaseService,
    public channelFirebaseService: ChannelFirebaseService,
    public threadFirebaseService: ThreadFirebaseService,
    public userFirebase: UserFirebaseService) {
    if (channelFirebaseService.selectedChannel) {
      this.answersPath = `channels/${channelFirebaseService.selectedChannel.id}/messages/${this.threadFirebaseService.message.id}/answers/`;
    }
    console.log(this.threadFirebaseService.loadedAnswers);
  }


  getMessageTimeString(message: Message) {
    const currentDay = this.formatDateToDMY(new Date());
    const messageDmy = this.formatDateToDMY(new Date(message.timestamp));
    if (currentDay == messageDmy) {
      return "heute";
    } else {
      return messageDmy;
    }
  }

  toggleEmojiList() {
    this.showEmojiList = !this.showEmojiList;
  }

  closeEmojiList() {
    this.showEmojiList = false;
  }

  openToolbar() {
    this.showToolbar = true;
  }

  closeToolbar() {
    this.showToolbar = false;
  }

  formatDateToDMY(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');      // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (add 1 because months are zero-based) and pad with leading zero if necessary
    const year = date.getFullYear();                              // Get year
    return `${day}.${month}.${year}`;
  }

  formatTimestampToHHMM(timestamp: number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits with leading zero
    return hours + ':' + minutes;
  }

  formatTimeDelta(timestamp: number): string {
    const now = new Date().getTime();
    const delta = now - timestamp;
    const oneDayInMs = 24 * 60 * 60 * 1000; // One day in milliseconds

    const yesterdayDmy = this.formatDateToDMY(new Date(now - oneDayInMs));
    const timestampDmy = this.formatDateToDMY(new Date(timestamp));

    if (yesterdayDmy == timestampDmy) {
      return "gestern";
    } else if (delta < oneDayInMs) {
      return this.formatTimestampToHHMM(timestamp);
    } else {
      const daysAgo = Math.floor(delta / oneDayInMs);
      return `vor ${daysAgo} Tagen`;

    }
  }

}