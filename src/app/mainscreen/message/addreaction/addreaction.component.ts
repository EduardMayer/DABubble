import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-addreaction',
  templateUrl: './addreaction.component.html',
  styleUrls: ['./addreaction.component.scss']
})
export class AddreactionComponent {
  public _isOpened = true;
  @Input() emojiInput$: Subject<string> | undefined;
  @ViewChild('container', { static: true }) emojiMartElement: ElementRef | undefined;

  @Output() emojiSelectedOutput: EventEmitter<string> = new EventEmitter<string>();
  clickListener: any;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  // Define the isOpened property with a setter
  @Input() set isOpened(value: boolean) {
    if (this._isOpened !== value) {
      this._isOpened = value;
    }
  }



  ngAfterViewInit() {
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const emojiMartElement = this.el.nativeElement.querySelector('.picker');
      if (emojiMartElement.contains(event.target as Node)) {
      } else {
        this.emojiSelectedOutput.emit("noSelection");
      }
    });
  }

  get isOpened(): boolean {
    return this._isOpened;
  }


  /**
  * Handles the selection of an emoji.
  *
  * @param {any} event - The event object representing the selected emoji.
  * 
  * This method is triggered when an emoji is selected. It:
  * - Sends the selected emoji to the emojiInput$ Subject (if available).
  * - Emits the selected emoji using the emojiSelectedOutput EventEmitter.
  */
  emojiSelected(event: any) {
    this.emojiInput$?.next(event.emoji.native);
    const selectedEmoji = event.emoji.native;
    this.emojiSelectedOutput.emit(selectedEmoji);
  }


  /**
   * Remove the event listener in the ngOnDestroy hook to prevent memory leaks
   */
  ngOnDestroy() {
   
    if (this.clickListener) {
      this.clickListener();
    }
  }

}
