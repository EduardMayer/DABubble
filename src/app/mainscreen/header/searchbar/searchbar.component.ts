import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { User } from 'src/models/user.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
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

  constructor(private userService:UserFirebaseService, private channelService:ChannelFirebaseService){}

  ngOnInit(): void {
    //this.searchResults = ["Hallo", "Test", "Search"]; 
    //this.userService.load(); 
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

  async getUsers(){
   
    this.searchResultsUsers = []; 
    console.log("Loaded Users:");
    console.log(this.userService.loadedUsers);

    this.userService.loadedUsers.forEach(user => {
      if(user.fullName.toUpperCase().includes(this.searchText.toUpperCase())){  
        this.searchResultsUsers.push(user); 
      }
    });
    
    
    /*
    this.userService.getUserForSearch(this.searchText)
        .then( (users) => {
          this.searchResultsUsers = users; 
        });
    */
  }
  getChannels(){
   

    this.searchResultsChannels = []; 
    console.log("Loaded Channels:");
    console.log(this.channelService.loadedChannels);

    this.channelService.loadedChannels.forEach(channel => {
      if(channel.channelName.toUpperCase().includes(this.searchText.toUpperCase())){  
        this.searchResultsChannels.push(channel); 
      }
    });
    
    /*
    this.userService.getChannelForSearch(this.searchText)
    .then( (channels) => {
      this.searchResultsChannels = channels; 
    });
    */ 
  }

  clickUser(index:any){
    console.log("Send New Message to User with ID: ");
    console.log(this.searchResultsUsers[index]);
  }

  clickChannel(index:any){
    this.channelService.selectChannel(this.searchResultsChannels[index].id); 
  }

}
