import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, ViewChild, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { DataService } from './data.service';
import { ItemModel } from './item-model';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public searchModel: any;
  
  // navbarCollapsed: boolean = false;
  mobileview: boolean = false;
  title: string = "USC Films";

  @ViewChild('searchform', {static: true}) searchForm: NgForm;
  @ViewChild('homelink', { static: false }) homelink: ElementRef;
  @ViewChild('listlink', { static: false }) listlink: ElementRef;

  search: OperatorFunction<string, any> = (text$: Observable<string>) =>
  text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(query =>
        this.configService.getData(`/search/multi/${ query.trim() }`).pipe(
            catchError(() => {
              return of([]);
            })
        ))
  );

  formatter = (x: {name: string}) => x.name;

  constructor(public configService: ConfigService,
              public dataService: DataService,
              public storageService: StorageService,
              private router: Router,
              private brkptObserver: BreakpointObserver) { }

  ngOnInit()
  {
  }

  ngAfterViewInit()
  {
    this.brkptObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe((brkptstate: BreakpointState) => {
        if(brkptstate.matches)
        {
          this.mobileview = true;
        }
        else
        {
          this.mobileview = false;
        }
    });
  }

  onItemSelect(selectEvent: any, searchInput: any)
  {
    selectEvent.preventDefault();
    searchInput.value = "";
    let item = selectEvent.item;
    let obj: ItemModel = {id: item.id, caption: item.title?item.title:item.name, category: item.media_type, imagesrc: item.image_path };
    this.storageService.getObj('contwatching')
      .subscribe(res => {
          let itemIndex = res.findIndex(x => {
            return x.id == obj.id;
          });
          if(itemIndex == -1)
          {
              if(res.length >= 24)
              {
                  res.splice(0,1)
              }
              res.push(obj);
          }
          else
          {
              res.splice(itemIndex, 1);
              res.push(obj);
          }
          this.storageService.setObj('contwatching', res);
      })
    this.dataService.itemSubject.next(obj);
    this.router.navigateByUrl(`/watch/${ item.media_type }/${ item.id }`)
  }

  navbarButtonClicked()
  {
    console.log("capturing the click");
  }
}
