import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent {

  _searchValue: string = "";
  showUserSearch = false;
  searchResultsUsers: User[] = [];
  clickListener: any;

  @Input() set searchValue(value: string) {
    this._searchValue = value;
    this.getUsers(this._searchValue);
  }

  @Output() userName: EventEmitter<User | boolean> = new EventEmitter<User | boolean>();

  /**
   * Defines services
   * @param userService 
   * @param renderer 
   * @param el 
   */
  constructor(
    private userService: UserFirebaseService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}


  /**
  * Click event handler for user selection.
  *
  * @param {number} index - The index of the selected user in the search results.
  * @emits {string} userName - Emits the user name of the selected user.
  */
  clickUser(index: number) {
      this.userName.emit(this.searchResultsUsers[index]);
  }


  /**
  * Retrieves users based on a search string and populates the searchResultsUsers array.
  *
  * @param {string} searchString - The string to search for in user full names.
  * @returns {void}
  */
  getUsers(searchString: string) {
    this.searchResultsUsers = [];
    this.userService.loadedUsers.forEach(user => {
      if (user.fullName.toUpperCase().includes(searchString.toUpperCase())) {
        this.searchResultsUsers.push(user);
      }
    });
  }


  ngAfterViewInit() {
    this.addEventListenerToRemoveUserSelection();
  }


  /**
  * Adds a click event listener to the document to remove user selection when clicking outside the specified user search field.
  * @returns {void}
  */
  addEventListenerToRemoveUserSelection(){
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
    const userSearchField = this.el.nativeElement.querySelector('.user-search');
    if (!userSearchField.contains(event.target as Node)) {
        this.userName.emit(false);
      }
    });
  }
}
