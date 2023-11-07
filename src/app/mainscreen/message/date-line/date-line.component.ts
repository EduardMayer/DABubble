import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from 'src/models/message.class';
import { DateFormatService } from 'src/services/dateFormat.service';

@Component({
  selector: 'app-date-line',
  templateUrl: './date-line.component.html',
  styleUrls: ['./date-line.component.scss']
})
export class DateLineComponent{

  constructor(
    private dateFormatService: DateFormatService
    ){}

  messageTimeString: String | undefined;
  currentDayTimeString: string = this.dateFormatService.formatDateToDmy(new Date());



  @Input()
  public set messageTime(value: string) {
    this.messageTimeString=value;
  }



}
