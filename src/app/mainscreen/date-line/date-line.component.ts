import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from 'src/models/message.class';

@Component({
  selector: 'app-date-line',
  templateUrl: './date-line.component.html',
  styleUrls: ['./date-line.component.scss']
})
export class DateLineComponent{

  messageTimeString: String | undefined;
  currentDayTimeString: string = this.formatDateToDmy(new Date());


  @Input()
  public set messageTime(value: string) {
    this.messageTimeString=value;
  }
  /*
    this.messageTimeString = this.formatDateToDmy(new Date(value.timestamp));
    if (this.messageTimeString == this.currentDayTimeString) {
      this.messageTimeString = "today";
    }
  }
  */



  formatDateToDmy(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');      // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (add 1 because months are zero-based) and pad with leading zero if necessary
    const year = date.getFullYear();                              // Get year

    return `${day}.${month}.${year}`;
  }
}
