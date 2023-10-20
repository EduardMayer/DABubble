import { Component } from '@angular/core';
import { UserFirebaseService } from '../../services/user-firebase.service';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-test-module',
  templateUrl: './test-module.component.html',
  styleUrls: ['./test-module.component.scss']
})
export class TestModuleComponent {

  users: any[] | undefined;
  user: User;

 


  constructor(public firebaseService: UserFirebaseService) {
    this.firebaseService.loadUsers();
    
    
    this.user= new User(
      {
        id: "",
        firstName: "Frank",
        lastName: "White",
        mail: "ar@gmx.de",
        birthDate: "2000-03-17",
        street: "Teststrasse",
        zipCode: "12345",
        city: "HinterbachWest"
      }
    );

    this.firebaseService.updateUserDoc("",this.user);
  }




}
