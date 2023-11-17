import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StyleManagerService } from './services/style-manager.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private styleSubscription: Subscription = new Subscription();

  constructor(private styleManager: StyleManagerService) {}

  ngOnInit() {
    this.styleSubscription = this.styleManager.backgroundStyle$.subscribe(style => {
      document.body.style.background = style;
    });
  }

  ngOnDestroy() {
    if (this.styleSubscription) {
      this.styleSubscription.unsubscribe();
    }
  }
}
