import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, finalize, tap, shareReplay } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
  // Meaning that we will have only 1 instance of this service for the entire app
  providedIn: "root",
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messageService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    this.loadingService.loadingOn();

    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messageService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses)),
      // finalize - make sure to stop the loading indicator in any case.
      finalize(() => this.loadingService.loadingOff())
    );

    loadCourses$.subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    // this.loadingService.loadingOn();

    // getValue() will return us the last value emitted by this subject(in our case, a list of the current courses emitted by our subject)
    const courses = this.subject.getValue();
    const index = courses.findIndex((course) => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;

    // Emit the data immediately to whole of our app.
    this.subject.next(newCourses);

    // Then save the data to the backend
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course";
        console.log(message, err);
        this.messageService.showErrors(message);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
