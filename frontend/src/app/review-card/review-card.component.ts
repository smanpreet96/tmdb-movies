import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent implements OnInit {

  @Input() imgsrc: string;
  @Input() author: string;
  @Input() url: string;
  @Input() reviewcontent: string;
  @Input() voteavg: number;
  @Input() datentime: string;

  @ViewChild('revcard', { read: ElementRef, static: false }) revcard: ElementRef;
  @ViewChild('revimg', { read: ElementRef, static: false }) revimg: ElementRef;
  @ViewChild('revheader', { read: ElementRef, static: false }) revheader: ElementRef;

  dateObj: Date;

  constructor(private brkptObserver: BreakpointObserver) { }

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
          this.revcard.nativeElement.className = "mobile-review-card";
          this.revimg.nativeElement.className = "mobile-review-image";
          this.revheader.nativeElement.className = "mobile-review-header";
        }
        else
        {
          this.revcard.nativeElement.className = "review-card";
          this.revimg.nativeElement.className = "review-img";
          this.revheader.nativeElement.className = "review-header";
        }
    });
  }

}
