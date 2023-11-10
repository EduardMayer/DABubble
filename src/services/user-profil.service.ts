import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserProfilService {

  private openUserProfilSubject = new Subject<User>(); 
  openUserProfil$ = this.openUserProfilSubject.asObservable(); 

  private closeUserProfilSubject = new Subject<void>(); 
  closeUserProfil$ = this.closeUserProfilSubject.asObservable(); 

  constructor() { }

  openUserProfil(user:User){
    this.openUserProfilSubject.next(user);
  }

  close(){
    this.closeUserProfilSubject.next();
  }
}
