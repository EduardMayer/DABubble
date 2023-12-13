import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  public notText: string = "";
  public notDur: number = 2;
  public notAni: string = "shift-up";
  public messageType: string = "default"; //options e.g default, success, error

  @ViewChild('notContainer', { read: ElementRef }) notContainerElement: ElementRef | undefined;


  /**
   * defines the displayed message text
   * e.g. "Nutzer erfolgreich erzeugt"
   */
  @Input() set text(value: string) {
    this.notText = value;
  }


  /**
   * defines the general notification style
   * available styles: default, success, error
   */
  @Input() set type(value: string) {
    this.messageType = value;
  }


  /**
   * defines the type of animation to use
   * available types: shift-up, shift-left-in, shift-right-in
   */
  @Input() set animation(value: string) {
    this.notAni = value;
  }

  constructor(private host: ElementRef<HTMLElement>) {
  }

  ngAfterViewInit() {
    this.notContainerElement?.nativeElement.classList.add(this.notAni);

    setTimeout(() => {
      this.host.nativeElement.remove();
    }, this.notDur * 1000);
  }


  ngOnDestroy(): void {
    console.log("notification removed");
  }
  
  ngOnInit(): void {
    console.log('notification created');
  }
}

