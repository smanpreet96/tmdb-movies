import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ItemModel } from './item-model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    storage: Storage;

    constructor()
    {
        this.storage = window.localStorage;
        if(this.storage.length == 0)
        {
            this.setObj('watchlist', []);
            this.setObj('contwatching', []);
        }
    }

    get islocalstorage(): boolean
    {
        return !!this.storage;
    }

    getObj(key: string): Observable<Array<ItemModel>>
    {
        if(this.islocalstorage)
        {
            return of(JSON.parse(String(this.storage.getItem(key))));
        }
        return of();
    }

    setObj(key: string, objArr: Array<ItemModel>)
    {
        if(this.islocalstorage)
        {
            this.storage.setItem(key, JSON.stringify(objArr));
        }
    }

    removeObj(key: string, obj: ItemModel)
    {
        if(this.islocalstorage)
        {
            this.getObj(key)
                .subscribe(arr => {
                    let index = arr.findIndex(item => { return item.id == obj.id });
                    if (index > -1)
                    {
                        arr.splice(index, 1);
                        this.setObj(key, arr);
                    }
                });
        }
    }
}