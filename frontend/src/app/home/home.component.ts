import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  headings = ["Popular Movies", "Top Rated Movies", "Trending Movies", "Popular TV Shows", "Top Rated TV Shows", "Trending TV Shows", "Continue Watching"];
  categories = ['movie', 'tv', 'multi'];
  types = ['popular', 'top_rated', 'trending', 'continue']

  constructor(private brkptObserver: BreakpointObserver) { }

  ngOnInit()
  {
  }

}
