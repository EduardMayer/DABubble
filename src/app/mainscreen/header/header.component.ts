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

  user: any = new User({
    birthdate: "2000-03-23", 
    firstName: " ",
    lastName: " ", 
    id:"", 
    mail:"", 
    street:"", 
    zipCode:""
  }) ; 

  showHeaderMenu = false; 
  showHeaderUserProfil = false; 
  editUserMode = false; 

  constructor(private authService:AuthFirebaseService , private userService:UserFirebaseService , private router:Router){}

  async ngOnInit(): Promise<void> {
    //console.log( this.userService.getUserByUID(JSON.parse(localStorage.getItem('user')!).uid));
    const user = await this.userService.getUserByUID(JSON.parse(localStorage.getItem('user')!).uid);
    this.user = user; 
    //console.log("onInitHeadfer");
    //console.log(this.user);
  }

  logout(){
    this.showHeaderMenu = false;
    this.authService.logout(); 
    //this.router.navigate(['']);
  }

  toogleHeaderMenu(){
    this.showHeaderMenu = !this.showHeaderMenu; 
  }

  showProfil(){
    this.showHeaderMenu = false;
    this.showHeaderUserProfil = true; 
  }

  editUser(){

  }
}
