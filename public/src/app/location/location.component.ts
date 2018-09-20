import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
declare var google: any;


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],

    })
export class LocationComponent implements OnInit {
  errors: string[] = [];
  data: any;
  location: any = {
    lat: '', 
    lng: ''
  };
  random: any = {
    color: '',
    font: '',
    url: '',
    places: '',
  }
  now: any = {
    day: '',
    minutes: '',
    hour: '',
    string: '',
  };
  marker_one: any = {
    lat: '', 
    lng: '', 
    draggable: true, 
    street: '',
    iconUrl: 'assets/images/person_icon.png'
  };
  map: any = {
    zoom: 16
  };
  input: any = {
    intro: 0,
    radius: '',
    type: '',
  }
  place: any = {
    received: false,
    lat: '',
    lng: '',
    name: '',
    rating: '',
    open: '',
    vicinity: '',
    icon: '',
    photo: ''
  }
  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router) {
    this.data = [];
   }
  ngOnInit() {
    this.hideStuff();
    this.getLocation(this.location, this.marker_one);
    this.getRandomDesign();
  }
  hideStuff(){
    $('#map').hide();
    $('#location').hide();
    $('#radius').hide();
  }
  getLocation(location, marker_one){
    var x = document.getElementById("location");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess);
      } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    function geoSuccess(position) {
      x.innerHTML = "Latitude: " + position.coords.latitude + 
      ", Longitude: " + position.coords.longitude;
      location.lat = position.coords.latitude;
      location.lng = position.coords.longitude;
      marker_one.lat = position.coords.latitude;
      marker_one.lng = position.coords.longitude;
      $('#confirm_marker').click();
      $('#map').show();
    }
  }
  stopMarker($event, marker){
    marker.lat = $event.coords.lat;
    marker.lng = $event.coords.lng;
    console.log($event.coords.lng)
  }
  confirmMarker(marker){
    var geocoder = new google.maps.Geocoder();
    var latLng = new google.maps.LatLng(marker.lat, marker.lng);
      if (geocoder) {
        geocoder.geocode({ 'latLng': latLng}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            marker.street = results[0].address_components[1].long_name;
            console.log(marker.street)
          }
      })
    }
    marker.draggable = false; 
  }
  changeMarker(marker){
    this.map.zoom = 6;
    marker.draggable = true;
  }

  getRandomDesign(){
    var font = this.getFont();
    $("#header").css("font-family" , font);
    var color = this.getColor();
    $("#header").css("color" , color);
    $("body").css("color" , color);
    $("body").css("font-family" , font);
    $("body").css("border-left" , "0.5vw solid" + color);
    $("body").css("border-right" , "0.5vw solid" + color);
    $("body").css("border-top" , "0.5vh solid" + color);
    $("body").css("border-bottom" , "0.5vw solid" + color);
    $("button").css("color" , color);
    this.random.color = color;
    var font_two = this.getFont();
    $("#left").css("font-family" , font_two);
    var color_two = this.getColor();
    $("#left").css("background-color" , color_two);
    $("#header").css("background-color" , color_two);
    $("#body").css("background-color" , color_two);
    var font_three = this.getFont();
    var color_three = this.getColor();
    $("option").css("color" , color_three);
    $("option").css("font" , font_three);
  }
  getFont(){
    var fonts = [
      'Pacifico', 
      'Oswald', 
      'Titan One', 
      'Lobster',
      'Roboto', 
      'Black Han Sans', 
      'Abril Fatface',
      "'Indie Flower', cursive",
      "'Noto Serif',serif",
      "'Modern Antiqua', cursive",
    ]
    var random = Math.floor((Math.random() * fonts.length));
    var font = fonts[random];
    return font;
  }
  getColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getPlaces(){
    var key = "&key=AIzaSyCCDOMuoRJs6evSFsAs0JXrWY4Mt3mZCYk";
    var location = "location="+this.marker_one.lat+","+this.marker_one.lng; 
    var radius = "&radius="+this.input.radius;
    var type = "&types="+this.input.type;
    // this.random.url = base+location+radius+type+key;
    this.random.url = location+radius+type+key;
    var x = this._httpService.getPlaces(this.random.url)
    x.subscribe((data:any)=>{
      this.random.places =JSON.parse(data);
      console.log('places: ',  this.random.places);
      this.getPlace();
    })
    // this.getRandomDesign();
  }
  getPlace(){
    var number = this.random.places.results.length;
    var random = Math.floor((Math.random() * number));
    var place = this.random.places.results[random];
    this.place.received = true;
    this.place.name = place.name;
    this.place.icon = place.icon;
    this.place.lat = place.geometry.location.lat;
    this.place.lng = place.geometry.location.lng;
    this.place.vicinity = place.vicinity;
    this.place.rating = place.rating;    
    console.log(place)
  }
  tryAgain(){
    this.place.received = false;
    this.getRandomDesign();
    this.input.intro= 0,
    this.input.radius= 0,
    this.input.type= ''
  }
  getDirections(){
  }
  showRadius(){
    this.input.intro = 1;
    this.getRandomDesign();
  }
  showButton(){
    this.input.intro = 2;
    this.getRandomDesign();
  }
}

