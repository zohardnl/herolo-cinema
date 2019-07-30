import { Observable } from "rxjs";
import { Movie } from "../models/Movie";
import { ApiService } from "./api.service";
import { Injectable, ElementRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class MovieServiceService {
  private _movies: BehaviorSubject<Movie[]> = new BehaviorSubject([]);
  movies$: Observable<Movie[]> = this._movies.asObservable();
  favoriteMovies: Movie[] = [];

  constructor(private api: ApiService, private modal: MatSnackBar) { }

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
    let index: number;
    if (this._movies.value.length >= 1) {
      index = this._movies.value.findIndex(movie => movie.title === newMovie.title);
      if (index >= 0) {
        this._movies.value.splice(index, 1);
        this.modal.open("This movie already exist!", 'Add', {
          duration: 2000,
          panelClass: 'red-alert'
        });
        this._movies.next([...this._movies.value, newMovie]);
      }
      else {
        this._movies.next([...this._movies.value, newMovie]);
        this.modal.open("Movie added!", 'Add')._dismissAfter(2000);
      }
    }
    else {
      this._movies.next([...this._movies.value, newMovie]);
      this.modal.open("Movie added!", 'Add')._dismissAfter(2000);
    }
  }

  updateMovie(upMovie: Movie, newDataMovie: Movie) {
    let index: number;
    index = this._movies.value.findIndex(movie => movie === upMovie);
    this._movies.value[index].title = newDataMovie.title;
    this._movies.value[index].release_date = newDataMovie.release_date;
    this._movies.value[index].overview = newDataMovie.overview;
    this.modal.open("Movie updated!", 'Update')._dismissAfter(2000);
  }
}