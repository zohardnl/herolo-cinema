import { Observable } from "rxjs";
import { MovieServiceService } from "./../movie-service.service";
import { Movie } from "./../models/Movie";
import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-movie-list",
  templateUrl: "./movie-list.component.html",
  styleUrls: ["./movie-list.component.scss"]
})
export class MovieListComponent implements OnInit {
  movies$: Observable<Movie[]> = this.movies.movies$;
  movieInfo: Movie;

  constructor(private movies: MovieServiceService) {}

  ngOnInit() {}

  getInfoMovie(data: Movie) {
    this.movieInfo = data;
  }
}