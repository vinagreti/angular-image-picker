import { Component, EventEmitter , Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UserService } from './../user.service';
import { User } from './../user.model';
import { ValidatorService } from './../../shared/services/validator';

@Component({
    selector: 'user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

    @Input() user: User;

    @Output() insert: EventEmitter<User>;

    userForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private validatorService: ValidatorService
    ) {
        this.insert = new EventEmitter<User>();
    }

    ngOnInit() {
        this.startUser();
        this.startUserForm();
    }

    private startUser(){
        this.user = this.user ? this.user : new User();
    }

    private startUserForm(){
        this.userForm = this.formBuilder.group({
            name: [this.user.name, [Validators.required]],
            showPassword: [false],
            username: [this.user.username, Validators.compose([
                this.validatorService.requiredIf(!this.user.id)
            ])],
            password: [this.user.password, Validators.compose([
                this.validatorService.requiredIf(!this.user.id)
            ])],
            isAdmin: [this.user.isAdmin, [Validators.required]],
        });
    }

    save = () => {
        if(this.userForm.valid){
            let user = new User(this.user);

            user.name = this.userForm.controls.name.value;
            user.username = this.userForm.controls.username.value;
            user.password = this.userForm.controls.password.value;
            user.isAdmin = this.userForm.controls.isAdmin.value;

            let userWithSameUsername = this.userService.getByUsername(user.username);

            if(userWithSameUsername && userWithSameUsername.id != user.id){
                return this.userForm.controls.username.setErrors({notUnique: true});
            }

            this.user = this.userService.save(user);

            this.insert.emit(user);
        }
    }

}
