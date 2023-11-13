import { Component } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent {

  animationStart: boolean = false;
  animationLogo: boolean = false;
  d_none: boolean = false;

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
