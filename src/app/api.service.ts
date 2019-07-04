import { environment } from "./../environments/environment";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ElementRef, Injectable } from "@angular/core";
import { Movie } from "./models/Movie";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ApiService {
  num: number;
  url: Object;

  constructor(private http: HttpClient, private route: Router) {}

  //SHOW MOVIE REQUSEST
  getMovie(): Observable<Movie> {
    this.num = this.getNumber();
    return this.getMovieHttp().pipe(
      map(movieRes => {
        return {
          id: movieRes.results[this.num].id,
          title: movieRes.results[this.num].title,
          poster_path: movieRes.results[this.num].poster_path,
          release_date: movieRes.results[this.num].release_date,
          overview: movieRes.results[this.num].overview
        } as Movie;
      })
    );
  }

  getMovieHttp(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}?api_key=${
        environment.apiKey
      }&query=${this.getChar()}`
    );
  }

  //SEARCH MOVIE REQUEST
  searchMovieHttp(searchElement: ElementRef): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}?api_key=${environment.apiKey}&query=${
        searchElement.nativeElement.value
      }`
    );
  }

  searchMovie(search: ElementRef): Observable<Movie[]> {
    return this.searchMovieHttp(search).pipe(
      map(movies => {
        return movies.results;
      })
    );
  }

  //check image of movie if exits
  checkMovieImage(movie: any) {
    if (
      movie.poster_path !== undefined &&
      movie.poster_path !== "" &&
      movie.poster_path !== null
    ) {
      this.url = {
        background: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`
      };
    } else {
      this.url = {
        background: `url(https://content.schoolinsites.com/api/documents/ebbca81b01694c91aa908f5374842a9f.gif)`
      };
    }
    return this.url;
  }

  //RANDOM FUNCTIONS
  getChar(): string {
    return String.fromCharCode(Math.floor(Math.random() * (122 - 97 + 1)) + 97);
  }

  getNumber(): number {
    return Math.floor(Math.random() * 20);
  }
}
