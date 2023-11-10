import { Component, Input } from '@angular/core';
import { User } from 'src/models/user.class';
import { UserProfilService } from 'src/services/user-profil.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent {
  
  @Input() user:User = new User(); 

  constructor(private userProfilService: UserProfilService){

  }

  close(){
    this.userProfilService.close(); 
  }

}
