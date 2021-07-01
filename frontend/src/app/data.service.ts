import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ItemModel } from './item-model';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    itemSubject = new Subject<ItemModel>();
    private item: ItemModel;

    constructor()
    {
        this.itemSubject.subscribe(item => {
            this.itemmodel = item;
        });
    }

    get itemmodel()
    {
        return this.item;
    }

    set itemmodel(arg: ItemModel)
    {
        this.item = arg;
    }
}