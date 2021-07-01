import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ItemModel } from '../item-model';
import { ConfigService } from '../config.service';
import { StorageService } from '../storage.service';
import { DataService } from '../data.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {

  category: string;
  id: number;
  title: string;
  tagline: string;
  youtubekey: string;
  carouselHeadings = ['Recommended', 'Similar']
  recommended: string = "recommendations";
  similar: string = "similar";
  overview: string;
  castmembers = Array();
  reviews = Array();
  genres = Array();
  genrestring: string = "";
  langs = Array();
  langstring: string = "";
  voteavg: number;
  releasedate: string;
  runtimestring: string;
  added: boolean = false;
  removed: boolean = false;
  inWatchlist: boolean = false;
  itemIndex: number = -1;
  playerHeight: number = 200
  playerWidth: number = 350

  tempImgPath: string = "https://image.tmdb.org/t/p/w500/2mtQwJKVKQrZgTz49Dizb25eOQQ.jpg";

  private obj: ItemModel;
  private addedClick = new Subject<NgbAlert>();
  private removedClick = new Subject<NgbAlert>();

  @ViewChild('addedMessage', {static: false}) alertAdded: NgbAlert;
  @ViewChild('removedMessage', {static: false}) alertRemoved: NgbAlert;
  @ViewChild('detailscont', { read: ElementRef, static: false }) detailscont: ElementRef;
  @ViewChild('rightcont', { read: ElementRef, static: false }) rightcont: ElementRef;

  constructor(private route: ActivatedRoute,
    public configService: ConfigService,
    public storageService: StorageService,
    public dataService: DataService,
    private brkptObserver: BreakpointObserver)
  {
  }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(routeParams => {
      this.category = String(routeParams.get('category'));
      if(this.category == "movie")
      {
        this.carouselHeadings[0] = "Recommended Movies";
        this.carouselHeadings[1] = "Similar Movies";
      }
      else
      {
        this.carouselHeadings[0] = "Recommended Tv Shows";
        this.carouselHeadings[1] = "Similar Tv Shows";
      }
      this.id = Number(routeParams.get('id'));
      if(this.dataService.itemmodel)
      {
        this.obj = this.dataService.itemmodel;
      }
      else
      {
        this.obj = { id: this.id, category: this.category, caption: this.title }
        this.dataService.itemmodel = this.obj;
      }
      this.checkIfInStorage();
      this.getDetails();
      this.getVideos();
      this.getCast();
      this.getReviews();
    });

    this.addedClick.pipe(debounceTime(5000))
      .subscribe(() => {
        if(this.alertAdded)
        {
          this.alertAdded.close();
        }
      });
    
    this.removedClick.pipe(debounceTime(5000))
      .subscribe(() => {
        if(this.alertRemoved)
        {
          this.alertRemoved.close();
        }
      });
  }

  ngAfterViewInit()
  {
    this.brkptObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe((brkptstate: BreakpointState) => {
        if(brkptstate.matches)
        {
          this.playerHeight = 200
          this.playerWidth = 375
          this.detailscont.nativeElement.className = "mobile-details-container";
          this.rightcont.nativeElement.className = "mobile-right-container"
        }
        else
        {
          this.playerHeight = 360
          this.playerWidth = 750
          this.detailscont.nativeElement.className = "details-container";
          this.rightcont.nativeElement.className = "right-container"
        }
    });
  }

  checkIfInStorage()
  {
    this.storageService.getObj('watchlist')
      .subscribe(res => {
          this.itemIndex = res.findIndex(x => {
              return x.id == this.obj.id;
          });
          if(this.itemIndex > -1)
          {
            this.inWatchlist = true;
          }
          else
          {
            this.inWatchlist = false;
          }
    });
  }

  addToWatchlist()
  {
    this.added = true;
    this.inWatchlist = true;
    this.storageService.getObj('watchlist')
      .subscribe(res => {
          this.itemIndex = res.findIndex(x => {
            return x.id == this.obj.id;
          });
          if(this.itemIndex == -1)
          {
              if(res.length >= 24)
              {
                  res.splice(0,1)
              }
              res.push(this.obj);
          }
          else
          {
              res.splice(this.itemIndex, 1);
              res.push(this.obj);
          }
          this.storageService.setObj('watchlist', res);
      })
    this.addedClick.next(this.alertAdded);
  }

  removeFromWatchlist()
  {
    this.removed = true;
    this.inWatchlist = false;
    this.storageService.removeObj('watchlist', this.obj);
    this.removedClick.next(this.alertRemoved);
  }

  getDetails()
  {
    let urlpostfix = "/" + this.category + "/" + this.id;
    this.configService.getData(urlpostfix)
      .subscribe((data: any) => {
        if(data[0].title)
        {
          this.title = data[0].title;
        }
        else
        {
          this.title = data[0].name;
        }
        this.obj.caption = this.title;
        this.tagline = data[0].tagline;
        this.overview = data[0].overview;
        this.genres = [];
        for(let i=0; i<data[0].genres.length; i++)
        {
          this.genres.push(data[0].genres[i].name);
        }
        this.genrestring = this.genres.join();
        this.langs = [];
        for(let i=0; i<data[0].spoken_languages.length; i++)
        {
          this.langs.push(data[0].spoken_languages[i].english_name);
        }
        this.langstring = this.langs.join();
        this.voteavg = data[0].vote_average;
        if(data[0].release_date)
        {
          this.releasedate = data[0].release_date.substr(0, 4);
        }
        else
        {
          this.releasedate = data[0].first_air_date.substr(0, 4);
        }
        if(data[0].episode_run_time)
        {
          this.runtimestring = data[0].episode_run_time[0]+"mins";
        }
        else if(data[0].runtime)
        {
          let time = Number(data[0].runtime);
          let hours = Math.floor(time/60);
          let mins = time % 60;
          this.runtimestring = hours+"hrs " + mins+"mins";
        }
      });
  }

  getVideos()
  {
    let urlpostfix = "/" + this.category + "/" + this.id + "/videos";
    this.configService.getData(urlpostfix)
      .subscribe((data: any) => {
        if(data[0])
        {
          this.youtubekey = data[0].key;
        }
        else
        {
          this.youtubekey = "tzkWB85ULJY";
        }
      });
  }

  getCast()
  {
    let urlpostfix = "/" + this.category + "/" + this.id + "/credits";
    this.configService.getData(urlpostfix)
      .subscribe((data: any) => {
        this.castmembers = data;
      });
  }

  getReviews()
  {
    let urlpostfix = "/" + this.category + "/" + this.id + "/reviews";
    this.configService.getData(urlpostfix)
      .subscribe((data: any) => {
        this.reviews = data.length>10? data.slice(0, 10) : data;
      });
  }
}
