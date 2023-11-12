import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { UserProfilService } from 'src/services/user-profil.service';
import { UserStatusFirebaseService } from 'src/services/user-status-firebase.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent implements OnInit{
  
  @Input() user:User = new User(); 

  constructor(private userProfilService: UserProfilService, private userStatusService: UserStatusFirebaseService){

  }

  ngOnInit(): void {
    console.log("onInit");
    this.getStatus();
  }


  

  close(){
    this.userProfilService.close(); 
  }

  getStatus(){
    this.userStatusService.getUserStatus(this.user.id)
      .then((result) => {
        this.user.status = result;   
      })
      .catch((error) => {
        console.log(error);    
      }); 
    
  }

}
