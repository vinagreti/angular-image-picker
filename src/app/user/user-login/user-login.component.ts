import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import  { UserService } from './../user.service';

@Component({
    selector: 'app-user-login',
    templateUrl: './user-login.component.html',
    styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

    loginForm: FormGroup;
    returnTo: string;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.getRouteParams();
        this.startLoginForm();
    }

    private getRouteParams(){
        this.route.queryParams.subscribe((params) => {
            this.returnTo = params.returnTo;
        })
    }

    private startLoginForm(){
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    login() {
        if(this.loginForm.valid){
            this.userService.login(this.loginForm.value)
            .then(
                (res) => {
                    if(this.returnTo){
                        this.router.navigate([this.returnTo]);
                    } else {
                        this.router.navigate(['/']);
                    }
                }, (err) => {
                    this.loginForm.controls.username.setErrors({notMatch: true});
                }
            );
        }
    }
}
