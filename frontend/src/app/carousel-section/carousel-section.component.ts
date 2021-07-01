import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../config.service';
import { ItemModel } from '../item-model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-carousel-section',
  templateUrl: './carousel-section.component.html',
  styleUrls: ['./carousel-section.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbCarouselConfig]
})
export class CarouselSectionComponent implements OnInit {

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  @ViewChild('mobilecarousel', {static : true}) mobileCarousel: NgbCarousel;
  @Input() carouselHeading: string;
  @Input() category: string;
  @Input() type: string;
  @Input() id: number;

  resultsLength: number;
  itemsData = Array();
  itemsDataMobile = Array();
  navigationIndicators: boolean = false;

  constructor(public configService: ConfigService,
              public storageService: StorageService,
              carouselConfig: NgbCarouselConfig)
  {
    carouselConfig.wrap = false;
  }

  ngOnInit(): void
  {
    let urlpostfix: string = "";
    if(this.type == "continue")
    {
      this.storageService.getObj('contwatching')
        .subscribe(data => {
          this.resultsLength = data.length;
          data = this.resultsLength>24? data.reverse().slice(23):data.reverse();
          let itemSet = [];
          for(let i=0; i<this.resultsLength+1; i++)
          {
            if(i>0 && (i%6 == 0 || i == this.resultsLength))
            {
              this.itemsData.push(itemSet);
              itemSet = []
            }
            if(data[i])
            {
              let item: ItemModel = { category: data[i].category, id: data[i].id, caption: data[i].caption, imagesrc: data[i].imagesrc }
              this.itemsDataMobile.push(item);
              itemSet.push(item);
            }
          }
        });
    }
    else
    {
      if(this.type == "trending")
      {
        urlpostfix = "/" + this.type + "/" + this.category;
      }
      else if(this.type == "recommendations" || this.type == "similar")
      {
        urlpostfix = "/" + this.category + "/" + this.id + "/" + this.type;
      }
      else
      {
        urlpostfix = "/" + this.category + "/" + this.type;
      }
      this.configService.getData(urlpostfix)
        .subscribe((data: any) => {
            this.resultsLength = data.length;
            let itemSet = [];
            for(let i=0; i<this.resultsLength+1; i++)
            {
              if(i>0 && (i%6 == 0 || i == this.resultsLength))
              {
                this.itemsData.push(itemSet);
                itemSet = []
              }
              if(data[i])
              {
                let item: ItemModel = {
                  category: data[i].title?'movie':'tv',
                  id: data[i].id,
                  caption: data[i].title?data[i].title:data[i].name,
                  imagesrc: data[i].image_path?data[i].image_path:"http://localhost:8080/images/movie_placeholder.png" }
                this.itemsDataMobile.push(item);
                itemSet.push(item);
              }
            }
        });
    }
  }
}