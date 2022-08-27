import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

type UsersData = {
  status: string;
  age: number;
};

type Users = {
  data: UsersData[];
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  users: Users = {
    data: [
      {
        status: 'active',
        age: 20,
      },
      {
        status: 'inactive',
        age: 17,
      },
      {
        status: 'active',
        age: 25,
      },
      {
        status: 'active',
        age: 39,
      },
      {
        status: 'inactive',
        age: 21,
      },
    ],
  };
  constructor() {}
  ngOnInit(): void {
    // The observable is emitting the users data , then when we subscribe to it, the observer gets the users data that the observable sent to him.
    const observable = new Observable((subscriber) => {
      subscriber.next(this.users);
      // The observable will send data to the pipe first, the pipe gets operators(map, filter etc) then the last operator will send the data to the observer.

      // Will hit the observer complete
      subscriber.complete();
    }).pipe(
      map((value: any) => {
        return value.data;
      }),
      map((value: UsersData[]) => {
        return value.filter((user) => user.status === 'active');
      }),
      map((value: any) => {
        return (
          value.reduce((sum: number, user: UsersData) => sum + user.age, 0) /
          value.length
        );
      }),
      // If the error will be execute, the observer will catch that error and log the message.
      map((value: any) => {
        if (value < 18) throw new Error('Avg age is to young');
        else return value;
      })
    );

    // The observer gets the data from the observable (users data)
    const observer = {
      next: (value: unknown) => {
        console.log('Observer got a value of ' + value);
      },
      error: (err: unknown) => {
        console.log('Observer got an error of ' + err);
      },
      complete: () => {
        console.log('Observer got a complete notification');
      },
    };

    observable.subscribe(observer);
  }
}
