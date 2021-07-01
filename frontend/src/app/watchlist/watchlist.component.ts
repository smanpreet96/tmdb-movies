import { Component, OnInit } from '@angular/core';
import { ItemModel } from '../item-model';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  objects: Array<ItemModel>;

  constructor(public storageService: StorageService) { }

  ngOnInit()
  {
    this.storageService.getObj('watchlist')
      .subscribe(result => {
         this.objects = result.length > 20 ? result.reverse().slice(0, 19) : result.reverse();
      });
  }
}
