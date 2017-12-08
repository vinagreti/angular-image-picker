import { APP_BASE_HREF } from '@angular/common';
import { TestBed, async } from '@angular/core/testing';
import { MatButtonModule, MatIconModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

// Global Components
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './static-pages/page-not-found.component';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Global Services
import { UserService } from './user';

// Globla Modules
import { ConfirmationDialogModule } from './shared/services/confirmation-dialog';
import { GuardModule } from './shared/guard';
import { JsonStorageModule } from './json-storage/json-storage.module';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                HomeComponent,
                PageNotFoundComponent,
            ],
            imports: [
                AppRoutingModule,
                ConfirmationDialogModule,
                GuardModule,
                JsonStorageModule,
                MatButtonModule,
                MatIconModule,
                MatSidenavModule,
                MatToolbarModule,
            ],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                UserService
            ]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'UsersApp'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('UsersApp');
    });

    it('should render the toolbar', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.main-toolbar')).toBeTruthy();
    });

    it('should render title in the toolbar', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.tootlbar-title').textContent).toContain('UsersApp');
    });

    it('should render the content', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });
});
