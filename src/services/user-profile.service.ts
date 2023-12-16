import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private openUserProfilSubject = new Subject<User>(); 
  openUserProfil$ = this.openUserProfilSubject.asObservable(); 

  private closeUserProfilSubject = new Subject<void>(); 
  closeUserProfil$ = this.closeUserProfilSubject.asObservable(); 

  constructor() { }

  /**
   * Triggers Observable to open userprofil for given user. 
   * @param user - User to be displayed 
   */
  openUserProfil(user:User){
    this.openUserProfilSubject.next(user);
  }

  /**
   * Triggers Observable to close any userprofil. 
   */
  close(){
    this.closeUserProfilSubject.next();
  }
}
