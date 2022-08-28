import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";

@Injectable({
  // providedIn, means that there will be only one instance of this service that is available to the whole app.
  providedIn: "root",
})
export class CourseService {
  constructor(private http: HttpClient) {}

  /* - This service will be reactive service so it will return an observable that emits only one value if the http call will be successful.
       That value will be the array of courses.
     - this service is stateless service, meaning that its not keeping data in memory. */
  loadAllCourses(): Observable<Course[]> {
    return (
      this.http
        /* This get method without pipe will return the next structure:
        payload: [{}, {}, ...].
        when we use pipe here, we kind of destructuring the data array from payload. same as const { data: courses } = response
    */
        .get<Course[]>("/api/courses")
        .pipe(
          map((res) => res["payload"]),
          shareReplay()
        )
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }
}
