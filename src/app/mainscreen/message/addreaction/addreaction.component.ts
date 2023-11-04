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
  @Output() emojiBarVisibilityOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  // Define the isOpened property with a setter
  @Input() set isOpened(value: boolean) {
    if (this._isOpened !== value) {
      this._isOpened = value;
    }
  }



  ngAfterViewInit() {
    // Get the native element of the emoji-mart component
    

    // Add a click event listener to the emoji-mart component
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      // Check if the event target is inside the emoji-mart element

      const emojiMartElement = this.el.nativeElement.querySelector('.picker');
      if (emojiMartElement.contains(event.target as Node)) {
        //Clicked inside emoji-mart element
        console.log('Clicked inside emoji-mart element');
      }else{
        //Clicked outside emoji-mart element
        console.log('Clicked outside emoji-mart element');
        this.emojiBarVisibilityOutput.emit(false); 
      }
    });
  }









  // Getter for isOpened property
  get isOpened(): boolean {
    return this._isOpened;
  }

  
  emojiSelected(event: any) {
    this.emojiInput$?.next(event.emoji.native);
    const selectedEmoji = event.emoji.native;
    console.log(selectedEmoji);
    this.emojiSelectedOutput.emit(selectedEmoji);
  }
  
}
