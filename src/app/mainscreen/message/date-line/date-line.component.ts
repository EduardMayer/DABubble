import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from 'src/models/message.class';
import { FormatService } from 'src/services/format.service';

@Component({
  selector: 'app-date-line',
  templateUrl: './date-line.component.html',
  styleUrls: ['./date-line.component.scss']
})
export class DateLineComponent{

  constructor(
    private formatService: FormatService
    ){}

  messageTimeString: String | undefined;
  currentDayTimeString: string = this.formatService.formatDateToDMY(new Date());

  @Input()
  public set messageTime(value: string) {
    this.messageTimeString=value;
  }
}
