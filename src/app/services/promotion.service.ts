import { Injectable } from '@angular/core'; 
import { Promotion } from '../shared/promotion'; 
import { Observable } from 'rxjs'; 
import { Http, Response } from '@angular/http'; 
import { baseURL } from '../shared/baseurl'; 
import { ProcessHTTPMsgService } from './process-httpmsg.service'; 
import {map, delay, catchError} from 'rxjs/operators'; 


/*  Generated class for the DishProvider provider.  See https://angular.io/docs/ts/latest/guide/dependency-injection.html  for more info on providers and Angular 2 DI. */ 
@Injectable() 
export class PromotionService {
    constructor(public http: Http, 
        private processHTTPMsgService: ProcessHTTPMsgService) { }

    getPromotions(): Observable<Promotion[]> { 
        return this.http.get(baseURL + 'promotions') 
        .pipe(map(res => { return this.processHTTPMsgService.extractData (res); }) 
        ,catchError(error => { return this.processHTTPMsgService .handleError(error); })); 
    }


    getPromotion(id: number): Observable<Promotion> { 
        return this.http.get(baseURL + 'promotions/'+ id) 
        .pipe(map(res => { return this.processHTTPMsgService.extractData (res); }) 
        ,catchError(error => { return this.processHTTPMsgService .handleError(error); })); 
    }

    getFeaturedPromotion(): Observable<Promotion> { 
        return this.http.get(baseURL + 'promotions?featured=true') 
        .pipe(map(res => { return this.processHTTPMsgService.extractData (res)[0]; }) 
        ,catchError(error => { return this.processHTTPMsgService .handleError(error); })); 
    }
}
