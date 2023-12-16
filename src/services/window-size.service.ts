import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService implements OnInit{

  private windowWidthSubject = new Subject<number>();
  windowWidth$ = this.windowWidthSubject.asObservable();

  constructor() {
    this.windowWidthSubject.next(window.innerWidth);
    window.addEventListener('resize', () => {
      this.windowWidthSubject.next(window.innerWidth);
    });
  }

  ngOnInit(){
    this.windowWidthSubject.next(window.innerWidth);
  }

  setWindowSize(){
    this.windowWidthSubject.next(window.innerWidth);
  }
}
