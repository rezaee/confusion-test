import { Injectable } from '@angular/core'; 
import { Dish } from '../shared/dish'; 
import { Observable } from 'rxjs'; 
import { Http, Response } from '@angular/http'; 
import { baseURL } from '../shared/baseurl'; 
import { ProcessHTTPMsgService } from './process-httpmsg.service'; 
import {map, delay, catchError} from 'rxjs/operators'; 


@Injectable() export class DishService {

    constructor(public http: Http, 
        private processHTTPMsgService: ProcessHTTPMsgService) { }
    
    getDishes(): Observable<Dish[]> { 
        return this.http.get(baseURL + 'dishes')
        .pipe(map(res => { return this.processHTTPMsgService.extractData (res); }) 
        ,catchError(error => { return this.processHTTPMsgService .handleError(error); })); 
    }

    getDish(id: number): Observable<Dish> { 
        return this.http.get(baseURL + 'dishes/'+ id) 
        .pipe(map(res => { return this.processHTTPMsgService.extractData (res); }) 
        ,catchError(error => { return this.processHTTPMsgService .handleError(error); }));
    }

    getFeaturedDish(): Observable<Dish> { 
        return this.http.get(baseURL + 'dishes?featured=true') 
        .pipe(map(res => { return this.processHTTPMsgService.extractData (res)[0]; }) 
        ,catchError(error => { return this.processHTTPMsgService .handleError(error); })); 
    }
}
