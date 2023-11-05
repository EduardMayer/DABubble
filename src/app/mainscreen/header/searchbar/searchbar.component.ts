import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit{

  searchText: string = ""; 
  searchResults: string[] = []; 
  searchResultsUsers: User[] = []; 
  searchResultsChannels: Channel[] = []; 

  testData: string[] = ["hallo", "Test", "Search"]; 



  constructor(private userService:UserFirebaseService){}

  ngOnInit(): void {
    //this.searchResults = ["Hallo", "Test", "Search"]; 
  }

  sendData(event:Event){
    if(this.searchText != ""){
      //console.log(this.searchText);
      this.searchResults = this.testData.filter(s => s.includes(this.searchText)); 
      this.getUsers(); 
      this.getChannels(); 
    }
    else{
      this.searchResults = []; 
      this.searchResultsUsers = [];
      this.searchResultsChannels = [];
    }
  }

  getUsers(){
    this.userService.getUserForSearch(this.searchText)
        .then( (users) => {
          this.searchResultsUsers = users; 
        });
  }
  getChannels(){
    this.userService.getChannelForSearch(this.searchText)
    .then( (channels) => {
      this.searchResultsChannels = channels; 
    });
  }

  clickUser(index:any){
    console.log("Send New Message to User with ID: ");
    console.log(this.searchResultsUsers[index]);
  }

  clickChannel(index:any){
    console.log("Click Channel with ID: ");
    console.log(this.searchResultsChannels[index]);
  }

}
