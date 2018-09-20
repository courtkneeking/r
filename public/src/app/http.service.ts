import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// @Injectable()
export class HttpService {
  constructor(private _http: HttpClient) { }
  // getPlaces(url, place){
  //   return this._http.get('https://pokeapi.co/api/v2/pokemon/4/', place);
  // }
  getPlaces(url){
    return this._http.get('/place/'+url);
  }
  // getPlaces(url){
  //   return this._http.get(url);
  // }
}