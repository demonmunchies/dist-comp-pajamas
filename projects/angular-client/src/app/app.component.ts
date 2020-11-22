import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';

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

  constructor(private router: Router, private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.router.events.pipe(mergeMap(event => {
      return this.isHandset$;
    })).subscribe(isSideNavVisible => {
      if (isSideNavVisible) {
        this.sideNav.close();
      }
    });
  }

  onSideNavRoute(routeTitle: string) {
    this.currentRouteTitle = routeTitle;
  }

}
