import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { ItemModel } from 'src/app/item-model';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.css']
})
export class CarouselItemComponent implements OnInit {

  item: ItemModel;
  itemIndex: number;

  @ViewChild('carimg', { read: ElementRef, static: false }) carouselImg: ElementRef;
  @ViewChild('overlay', { read: ElementRef, static: false }) overlay: ElementRef;
  @ViewChild('itemlink', { read: ElementRef, static: false }) itemlink: ElementRef;

  @Input() imgsrc: string;
  @Input() category: string;
  @Input() caption: string;
  @Input() id: number;

  constructor(public dataService: DataService,
              public storageService: StorageService,
              private router: Router,
              private brkptObserver: BreakpointObserver)
  {
    this.item = { category: '', id: 0, caption: '' };
  }

  ngOnInit()
  {
    this.item.category = this.category;
    this.item.id = this.id;
    this.item.imagesrc = this.imgsrc;
    this.item.caption = this.caption;
  }

  ngAfterViewInit()
  {
    this.brkptObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe((brkptstate: BreakpointState) => {
        if(brkptstate.matches)
        {
          this.carouselImg.nativeElement.className = "mobile-car-img";
          this.overlay.nativeElement.className = "mobile-overlay";
          this.itemlink.nativeElement.className = "mobile-link";
        }
        else
        {
          this.carouselImg.nativeElement.className = "carousel-item-img";
          this.overlay.nativeElement.className = "overlay";
          this.itemlink.nativeElement.className = "";
        }
    });
  }

  addToContWatching()
  {
    this.storageService.getObj('contwatching')
      .subscribe(res => {
          this.itemIndex = res.findIndex(x => {
            return x.id == this.item.id;
          });
          if(this.itemIndex == -1)
          {
              if(res.length >= 24)
              {
                  res.splice(0,1)
              }
              res.push(this.item);
          }
          else
          {
              res.splice(this.itemIndex, 1);
              res.push(this.item);
          }
          this.storageService.setObj('contwatching', res);
      })
    this.router.navigateByUrl(`/watch/${ this.category }/${ this.id }`);
    this.dataService.itemSubject.next(this.item);
  }

}
