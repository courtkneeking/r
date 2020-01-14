import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  location: any;
  constructor(private _http: HttpClient, private _router: Router) { }
  getPlaces(url){
    return this._http.get('/place/'+url);
  }
  saveLocation(location){
    console.log('saveLocation', location)
    this.location = location;
  }
  getCity(url){
    return this._http.get('/city/'+url);
  }
  giveLocation(){
    console.log('giveLocation', this.location)
    return this.location;
  }
  addReview(review){
    return this._http.post('/api/review', review)
  }
  getReviews(city){
    return this._http.get('/api/reviews/'+city);
  }
  addQuestion(question){
    return this._http.post('/api/faqs', question)
  }
}
