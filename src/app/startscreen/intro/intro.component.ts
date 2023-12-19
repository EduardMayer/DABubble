import { Component, OnInit } from '@angular/core';

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
        setTimeout(() => {
          this.d_none = true;
        }, 600);
      }, 1000);
    }, 1000);
  }

}
