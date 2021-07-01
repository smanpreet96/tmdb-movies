import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { LayoutModule } from '@angular/cdk/layout';

import { CarouselSectionComponent } from './carousel-section/carousel-section.component';
import { HomeCarouselComponent } from './home-carousel/home-carousel.component';
import { CarouselItemComponent } from './carousel-section/carousel-item/carousel-item.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { HomeComponent } from './home/home.component';
import { WatchComponent } from './watch/watch.component';
import { CastCardComponent } from './cast-card/cast-card.component';
import { ReviewCardComponent } from './review-card/review-card.component';
import { CastModalComponent } from './cast-modal/cast-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CarouselSectionComponent,
    HomeCarouselComponent,
    CarouselItemComponent,
    WatchlistComponent,
    HomeComponent,
    WatchComponent,
    CastCardComponent,
    ReviewCardComponent,
    CastModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    HttpClientJsonpModule,
    YouTubePlayerModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
