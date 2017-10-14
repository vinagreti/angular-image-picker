/*
* User Service
*
* Handle user authentication and CRUD operations
*
* As this demo has no back-end, we are mocking a DB in LocalStorage
* This service simulates an Ajax API call retunring promises with data from LocalStorage
* As this demo has no back-end, the credentials check is done on client without security concerns
* As this demo has no back-end, we ensure the presence of the default admin user
* API Tokens are not used in this demo, the authentication was meanted to simulate the flow not the security
* Password RESET and CHANGE were not implemented as they were not required in the test requirements
*/

import { Injectable, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import { ConfirmationDialogService } from './../shared/services/confirmation-dialog/';
import { JsonStorageService } from './../json-storage'

export const DefaultAdminUser = new User({ id: '1', name: 'Admin', isAdmin: true, username: 'admin', password: 123 });

interface LoginData{
    username: string;
    password: string;
}

@Injectable()
export class UserService {

    private _users: User[];
    private _user:  User;

    users: BehaviorSubject<User[]>;
    user: BehaviorSubject<User>;

    constructor(
        private confirmationDialogService: ConfirmationDialogService,
        private jsonStorageService: JsonStorageService,
        private router: Router,
    ) {
        console.info('UserService STARTED');

        this._users = new Array<User>();
        this._user = new  User();
        this.users = new BehaviorSubject<User[]>(this._users);
        this.user = new BehaviorSubject<User>(this._user);

        this.getUsersFromDb()
        .then(this.startUsers)
        .then(this.ensureDefaultAdminUser);

        this.getUserFromDb()
        .then(this.startUser);

        this.watchLocalStorage();
    }

    /* As this demo has no back-end, the credentials check is done on client without security concerns  */
    private authenticate(loginData: LoginData): User {
        let user: User = this.getByUsername(loginData.username);

        if(user){
            return user.password == loginData.password ? new User(user) : undefined;
        } else {
            return undefined;
        }
    }

    /* As this demo has no back-end, we ensure the presence of the default admin user  */
    private ensureDefaultAdminUser = () => {
        let user = this.getByUsername(DefaultAdminUser.username);
        if(!user){
            this._users.push(DefaultAdminUser)
        } else {
            user.password = DefaultAdminUser.password;
        }
        this.users.next(this._users);
    }

    /* As this demo has no back-end, we are mocking a DB in LocalStorage */
    private getUsersFromDb(){
        return this.jsonStorageService.get('usersDB');
    }

    private getUserFromDb(){
        return this.jsonStorageService.get('user');
    }

    private persistUsers = (users: User[]) => {
        this._users = users;
        this.jsonStorageService.set('usersDB', users);

        if(this.isLoggedIn()){ // Updates the loogged user data
            this.user.next(this.get(this._user.id));
        }
    }

    private persistUser = (user: User) => {
        this._user = user;
        this.jsonStorageService.set('user', user);
    }

    private startUsers = (users: User[]) => {
        this.users.subscribe(this.persistUsers);
        if(users){
            this.users.next(users);
        }
    }

    private startUser = (user: User) => {
        this.user.subscribe(this.persistUser);
        if(user){
            this.user.next(user);
        }
    }

    /*
    * REAL TIME SIMULATION
    *
    * You can open two diferent tabs in sabe browser to see it working
    * When you change the data in one tab the other tabs are changed too
    * Only forms are not using async data so we can ensure form data is not replaced when data changes
    */
    private watchLocalStorage(){
        setInterval(() => {
            this.getUsersFromDb()
            .then((users) => {
                if(users && JSON.stringify(users) != JSON.stringify(this._users)){
                    this.users.next(users);
                }
            });

            this.getUserFromDb()
            .then((user) => {
                if(user && JSON.stringify(user) != JSON.stringify(this._user)){
                    console.log("watchLocalStorage User timeout mudou")
                    this.user.next(user);
                }
            });
        }, 2000)
    }

    /*
    * CRUD OPERATIONS
    */
    create = (user: User): User => {
        if(this.isAdmin()){ // Only ADMIN can create
            user.id = Date.now();
            this._users.push(user)
            this.users.next(this._users);
            return user;
        }
    }

    delete = (user: User) => {
        if(this.isAdmin()){ // Only ADMIN can delete
            this.confirmationDialogService
            .confirm(`Remove user ${user.name}?`)
            .then((confirmed) => {
                if(confirmed){
                    let userPosition = this._users.indexOf(user);
                    this._users.splice(userPosition, 1);
                    this.users.next(this._users);
                    this.router.navigate(['/user']);
                }
            });
        }
    }

    get = (id): User => {
        return this._users.find((user: User) => user.id == id);
    }

    getByUsername = (username): User => {
        return this._users.find((user: User) => user.username == username);
    }

    save = (user: User): User => {
        if(this.isAdmin()){ // Only ADMIN can save
            if(user.id){
                return this.update(user);
            } else {
                return this.create(user);
            }
        }
    }

    update = (user: User): User => {
        if(this.isAdmin()){ // Only ADMIN can update
            let _user = this.get(user.id);
            _user.name = user.name;
            _user.avatar = user.avatar;
            _user.isAdmin = user.isAdmin;
            this.users.next(this._users);
            return _user;
        }
    }

    toggleAdmin = (user: User) => {
        if(this.isAdmin()){ // Only ADMIN can toggleAdmin
            this.confirmationDialogService
            .confirm(`${user.isAdmin ? 'Remove' : 'Add'} admin privileges ${user.isAdmin ? 'from' : 'to'} user ${user.name}?`)
            .then((confirmed) => {
                if(confirmed){
                    let _user = this.get(user.id);
                    _user.isAdmin = !user.isAdmin;
                    this.users.next(this._users);
                    return _user;
                }
            });
        }
    }

    /*
    * AUTH OPERATIONS
    */
    login = (LoginData: LoginData): Promise<User> => {
        return new Promise((res, rej) => {
            let user = this.authenticate(LoginData);

            if(user){
                this.user.next(user);
                res(user);
            } else {
                rej("Invalid credentials");
            }
        })
    }

    logout = () => {
        this.user.next(new User());
        this.router.navigate(['/']);
    }

    /*
    * HELPERS
    */
    isLoggedIn = (): boolean => {
        return this._user && this._user.id ? true : false;
    }

    isAdmin = () => {
        return this._user.isAdmin;
    }
}
