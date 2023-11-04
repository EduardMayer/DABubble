import { Component, OnInit } from '@angular/core';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit{

  searchText: string = ""; 
  searchResults: string[] = []; 
  searchResultsUsers: string[] = []; 

  testData: string[] = ["hallo", "Test", "Search"]; 



  constructor(private userService:UserFirebaseService){}

  ngOnInit(): void {
    //this.searchResults = ["Hallo", "Test", "Search"]; 
  }

  sendData(event:Event){
    if(this.searchText != ""){
      //console.log(this.searchText);
      this.searchResults = this.testData.filter(s => s.includes(this.searchText)); 
      this.userService.getUserForSearch(this.searchText);
      //console.log( this.searchResults); 
    }
    else{
      this.searchResults = []; 
    }
  }

  getUsers(){
    
  }

}
