import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StyleManagerService {
  private backgroundStyle = new BehaviorSubject<string>('');

  setBackgroundStyle(style: string) {
    this.backgroundStyle.next(style);
  }

  get backgroundStyle$() {
    return this.backgroundStyle.asObservable();
  }
}
