import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from './authentication/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MatSidenav) sideNav: MatSidenav;

  currentRouteTitle: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public auth: AuthenticationService
  ) { }

  ngOnInit() {

    this.router.events.pipe(filter(event => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        this.currentRouteTitle = event.snapshot.data?.routeTitle;
      });

    this.router.events.pipe(mergeMap(event => {
      return this.isHandset$;
    })).subscribe(isSideNavVisible => {
      if (isSideNavVisible) {
        this.sideNav.close();
      }
    });
  }

}
