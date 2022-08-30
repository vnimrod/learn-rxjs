import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap, concatMap, finalize } from "rxjs/operators";

@Injectable()
export class LoadingService {
  // BehaviorSubject - remember the last value emitted buy the subject.
  /*
    The main idea for this service is that when we consuming it from outside, we can only be able to subscribe to it.
    If we want to emit new value and use the .next() method, we will only able to do so through the service itself.
    why?
    loadingSubject - is private and can only be used inside this service in a way that we can only emit new values from here.
    loading$ - is public! derives the observable from the subject. that will make sure that when we use loading$ from outside, we can only subscribe to it
               and wont be able to emit new values through it.
  */
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // showLoadingUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
  //   return of(null).pipe(
  //     tap(() => this.loadingOn()),
  //     concatMap(() => obs$),
  //     finalize(() => this.loadingOff())
  //   );
  // }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
