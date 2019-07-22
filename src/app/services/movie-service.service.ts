import {Observable} from "rxjs";
import {Movie} from "../models/Movie";
import {ApiService} from "./api.service";
import {Injectable, ElementRef} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {tap} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class MovieServiceService {
  private _movies: BehaviorSubject<Movie[]> = new BehaviorSubject([]);
  movies$: Observable<Movie[]> = this._movies.asObservable();
  favoriteMovies: Movie[] = [];

  constructor(private api: ApiService, private modal: MatSnackBar) {}

  getMovie(): Observable<Movie> {
    return this.api.getMovie().pipe(
      tap(movie => {
        if (!this._movies.value.includes(movie)) {
          this._movies.next([...this._movies.value, movie]);
        }
      })
    );
  }

  getSearch(name: ElementRef): Observable<Movie[]> {
    return this.api.searchMovie(name).pipe(
      tap(movies => {
        if (movies.length >= 1) this._movies.next(movies);
        else this._movies.next([]);
      })
    );
  }

  resetMovies(): void {
    this._movies.next([]);
    this.favoriteMovies.splice(0);
  }

  setFavoriteMovie(movie: Movie) {
    this.favoriteMovies.push(movie);
  }

  removeFavoriteMovie(movie: Movie) {
    let index = this.favoriteMovies.indexOf(movie);
    this.favoriteMovies.splice(index, 1);
  }

  addNewMovie(newMovie: Movie) {
    if (!this._movies.value.includes(newMovie)) {
      this._movies.next([...this._movies.value, newMovie]);
      this.modal.open("Movie Added!")._dismissAfter(2000);
    } else {
      this.modal.open("This movie already exist!")._dismissAfter(2000);
    }
  }
}
