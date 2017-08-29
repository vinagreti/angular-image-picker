import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './../../user/';

/*
* CURRENT SUBSCRIPTION
*
* Used to run the guard in a reactive way. Changes done after the first digest cicle will be catch by the subscription.
* Singleton to avoid guards colision
*/
var currentSubscription = undefined;

// Admin Level
@Injectable()
export class AdminGuardService implements CanActivate {
    constructor(private userService: UserService, private router: Router) { console.log('AdminGuardService STARTED') }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(currentSubscription){
            currentSubscription.unsubscribe();
        }
        if (this.userService.isAdmin()) {
            currentSubscription = this.userService.user.subscribe((user) => {
                if (!this.userService.isAdmin()) {
                    console.log('NAVEGOU POR AQUI 1'); this.router.navigate(['/']);
                }
            });
            return true;
        } else {
            console.log('NAVEGOU POR AQUI 2'); this.router.navigate(['/']);
            return false;
        }
    }
}

// Logged Level
@Injectable()
export class LoggedGuardService implements CanActivate {
    constructor(private userService: UserService, private router: Router) { console.log('LoggedGuardService STARTED') }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(currentSubscription){
            currentSubscription.unsubscribe();
        }
        if (this.userService.isLoggedIn()) {
            currentSubscription = this.userService.user.subscribe((user) => {
                if (!this.userService.isLoggedIn()) {
                    console.log('NAVEGOU POR AQUI 3'); this.router.navigate(['/']);
                }
            });
            return true;
        } else {
            console.log('NAVEGOU POR AQUI 4'); this.router.navigate(['/']);
            return false;
        }
    }
}

// Public Level
@Injectable()
export class PublicGuardService implements CanActivate {
    constructor(private userService: UserService, private router: Router) { console.log('PublicGuardService STARTED') }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(currentSubscription){
            currentSubscription.unsubscribe();
        }

        if (!this.userService.isLoggedIn()) {
            currentSubscription = this.userService.user.subscribe((user) => {
                if (this.userService.isLoggedIn()) {
                    console.log('NAVEGOU POR AQUI 5'); this.router.navigate(['/']);
                }
            });
            return true;
        } else {
            console.log('NAVEGOU POR AQUI 6'); this.router.navigate(['/']);
            return false;
        }
    }
}
