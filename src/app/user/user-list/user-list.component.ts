import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from './../user.service';
import { User } from './../user.model';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

    showFilter: boolean;
    searchString: string;
    @ViewChild('searchStringField') searchStringField: ElementRef;

    constructor(
        public userService: UserService
    ) {}

    toggleFilter = () => {
        if(!this.searchString){
            this.showFilter = !this.showFilter;

            setTimeout(() => {
                if(this.showFilter){
                    this.searchStringField.nativeElement.focus();
                }
            }, 1)
        }
    }

}
