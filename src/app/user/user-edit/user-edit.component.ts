import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserService } from './../';

@Component({
  selector: 'tzd-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    user: User;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService
  ) { }

  ngOnInit() {
      this.route.params.subscribe((params) => {
          if (params.id) {
              this.loadUserData(params.id);
          }
      })
  }

  private loadUserData(id) {
      this.user = this.userService.get(id);
  }

  onSave() {
      this.router.navigate(['user'])
  }

}
