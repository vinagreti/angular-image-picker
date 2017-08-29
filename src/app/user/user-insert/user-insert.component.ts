import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './../user.service';
import { User } from './../user.model';

@Component({
  selector: 'app-user-insert',
  templateUrl: './user-insert.component.html',
  styleUrls: ['./user-insert.component.scss']
})
export class UserInsertComponent implements OnInit {

    constructor(
        private router: Router,
    	private userService: UserService
    ) { }

    ngOnInit() {
    }

    onSave(){
        this.router.navigate(['user'])
    }
}
