import { Component, Renderer2, OnInit } from '@angular/core';

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
   * Creates an instance of IntroComponent.
   * 
   * @param {Renderer2} renderer - The Angular Renderer2 service for DOM manipulation.
   */
  constructor(private renderer: Renderer2) {}

  /**
   * Initializes the component and triggers animations.
   * 
   * @memberof IntroComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.disableScroll(); 

    setTimeout(() => {
      this.animationStart = true;
      setTimeout(() => {
        this.animationLogo = true;
        setTimeout(() => {
          this.d_none = true;
          this.enableScroll();
        }, 600);
      }, 1000);
    }, 1000);
  }

  /**
   * Disables scrolling by setting the 'overflow' style of the body to 'hidden'.
   * 
   * @private
   * @memberof IntroComponent
   * @returns {void}
   */
  private disableScroll(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  /**
   * Enables scrolling by removing the 'overflow' style from the body.
   * 
   * @private
   * @memberof IntroComponent
   * @returns {void}
   */
  private enableScroll(): void {
    this.renderer.removeStyle(document.body, 'overflow');
  }
}
