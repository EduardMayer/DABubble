import { Component, EventEmitter, OnInit, Output } from '@angular/core';

/**
 * The IntroComponent displays an introduction with animations.
 *
 * @export
 * @class IntroComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

  animationStart: boolean = false;
  animationLogo: boolean = false;
  d_none: boolean = false;
  @Output() introComplete = new EventEmitter<boolean>();

  /**
   * Initializes the component and triggers animations.
   * 
   * @memberof IntroComponent
   * @returns {void}
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.animationStart = true;
      setTimeout(() => {
        this.animationLogo = true;
        //debugger
        setTimeout(() => {
          this.d_none = true;
          this.introComplete.emit(true);
        }, 600);
      }, 1000);
    }, 1000);
  }

}
