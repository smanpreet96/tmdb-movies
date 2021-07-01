import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../config.service';
import { ItemModel } from '../item-model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['./home-carousel.component.css']
})
export class HomeCarouselComponent {
  
  responsedata = Array();

  pauseOnHover = true;
  pauseOnFocus = true;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  constructor(public configService: ConfigService,
              public storageService: StorageService,
              private router: Router)
  {
      configService.getData("/movie/now_playing")
        .subscribe((data: any) => {
          this.responsedata = data.slice(0,5);
        });
  }

  gotodetailspage(data: any)
  {
    this.storageService.getObj('contwatching')
      .subscribe(res => {
          let itemIndex = res.findIndex(x => {
            return x.id == data.id;
          });
          let item: ItemModel = { id: data.id, caption: data.title, category: 'movie', imagesrc: data.image_path };
          if(itemIndex == -1)
          {
              if(res.length >= 24)
              {
                  res.splice(0,1)
              }
              res.push(item);
          }
          else
          {
              res.splice(itemIndex, 1);
              res.push(item);
          }
          this.storageService.setObj('contwatching', res);
      })
    this.router.navigateByUrl(`/watch/movie/${ data.id }`);
  }
}
