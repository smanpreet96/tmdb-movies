import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CastModalComponent } from '../cast-modal/cast-modal.component';

@Component({
  selector: 'app-cast-card',
  templateUrl: './cast-card.component.html',
  styleUrls: ['./cast-card.component.css']
})
export class CastCardComponent implements OnInit {

  @Input() name: string;
  @Input() character: string;
  @Input() imgsrc: string;
  @Input() id: number;

  constructor(private modalService: NgbModal) { }

  ngOnInit()
  {
  }

  openCastModal()
  {
    const modalRef = this.modalService.open(CastModalComponent, { centered: true, scrollable: true, size: 'lg' });
    modalRef.componentInstance.name = this.name;
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.imgsrc = this.imgsrc;
  }

}
