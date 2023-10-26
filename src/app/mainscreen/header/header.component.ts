import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  user: User = new User({
    birthdate: "2000-03-23", 
    firstName: "Guest",
    lastName: "User", 
    id:"", 
    mail:"", 
    street:"", 
    zipCode:"" 
  }) ; 

  showHeaderMenu = false; 

  constructor(private authService:AuthFirebaseService , private userService:UserFirebaseService , private router:Router){}

  ngOnInit(): void {
    //Get current UserID from Local Storage 
    //Get User from userService wirth UserID
  }

  logout(){
    this.authService.logout(); 
  }

  toogleHeaderMenu(){
    this.showHeaderMenu = !this.showHeaderMenu; 
  }
}
