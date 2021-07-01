import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-cast-modal',
  templateUrl: './cast-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./cast-modal.component.css']
})
export class CastModalComponent implements OnInit {

  @Input() name: string;
  @Input() imgsrc: string;
  @Input() id: number;

  @ViewChild('detcont', { read: ElementRef, static: false }) detcont: ElementRef;
  @ViewChild('castimg', { read: ElementRef, static: false }) castimg: ElementRef;
  @ViewChild('textcont', { read: ElementRef, static: false }) textcont: ElementRef;
  
  dob: any;
  pob: any;
  gender: any;
  website: any;
  knownfor: any;
  knownas: any;
  bio: any;
  imdburl: any;
  fburl: any;
  instaurl: any;
  twitterurl: any;

  constructor(public activeModal: NgbActiveModal,
              public configService: ConfigService,
              private brkptObserver: BreakpointObserver) { }

  ngOnInit(): void
  {
    let urlpostfix: string = "/person/" + this.id;
    this.configService.getData(urlpostfix)
      .subscribe((data: any) => {
          this.dob = data[0].birthday?data[0].birthday:false;
          if(data[0].gender == 1) { this.gender = 'Female' }
          else if(data[0].gender == 2) { this.gender = 'Male' }
          else { this.gender = 'Undefined' }
          this.pob = data[0].place_of_birth?data[0].place_of_birth:false;
          this.knownfor = data[0].known_for_department?data[0].known_for_department:false;
          this.knownas = data[0].also_known_as?data[0].also_known_as.join():false;
          this.bio = data[0].biography?data[0].biography:false;
          this.website = data[0].homepage?data[0].homepage:false;
      });
    
    urlpostfix = urlpostfix + "/external_ids";
    this.configService.getData(urlpostfix)
      .subscribe((data: any) => {
          this.imdburl = data[0].imdb_id ? "https://www.imdb.com/name/" + data[0].imdb_id : false;
          this.fburl = data[0].facebook_id ? "https://www.facebook.com/" + data[0].facebook_id : false;
          this.instaurl = data[0].imdb_id ? "https://www.instagram.com/" + data[0].instagram_id : false;
          this.twitterurl = data[0].twitter_id ? "https://twitter.com/" + data[0].twitter_id : false;
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
          this.detcont.nativeElement.className = "mobile-details-container";
          this.castimg.nativeElement.className = "mobile-cast-img";
          this.textcont.nativeElement.className = "mobile-text-container";
        }
        else
        {
          this.detcont.nativeElement.className = "details-container";
          this.castimg.nativeElement.className = "cast-img";
          this.textcont.nativeElement.className = "text-container";
        }
    });
  }
}
