import { Component, OnInit } from '@angular/core';
import { HttpService } from './../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { Title, Meta } from '@angular/platform-browser';


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
    lng: '',
    city: ''
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
  locationMarker: any = {
    lat: '', 
    lng: '', 
    draggable: true, 
    street: '',
    iconUrl : {
      url: 'assets/images/person_icon.png',
      scaledSize: {
        width: 25,
        height: 35,
      },
    },
  };
  placeMarker: any = {
    lat: '', 
    lng: '', 
    visible: true
  };
  map: any = {
    zoom: 16,
    lat: 0,
    lng: 0,
  };
  input: any = {
    radius: 0,
    type: '',
  }
  place: any = {
    received: false,
    lat: '',
    lng: '',
    name: '',
    vicinity: '',
    icon: '',
    rating: '',
    open: '',
    photo: '', 
    price_level: '',
    went: false,
  };
  origin: any;
  destination: any;
  dir: any = {
    visible : true,
    origin: '',
    destination: '',
  }
  showReviews: boolean = false;
  reviewForm: boolean = false;
  reviews;
  review : any = {
    user: '',
    text: '',
    city: '',
    place: '',
    vicinity: '',
    lat: '',
    lng: '',
    icon: ''
  };
  key = "insert";
  


  
  constructor(private _httpService: HttpService, private _route: ActivatedRoute, private _router: Router, private meta: Meta, private title: Title) {
    this.data = [];
    this.reviews = [];
    this.review = {user: '', text: '', city: '', place: '', lat: '', lng: '', icon: '', vicinity: ''};
    this.title.setTitle('Randomizer | Find something to do in your area');  
    this.meta.updateTag({name:'description',content:"The randomizer takes in your current location and specified parameters to give a random place in your area. Connect, review and enjoy totally random restaurants, bars, and more."});   
    this.meta.updateTag({name:'keyword',content:'places, random, find, fun, good restaurants, bars, reviews'});   
   }
  ngOnInit() {
    this.getRandomDesign();
    this.hideStuff();
    this.findLocation();
    $('#showInputs').show();
    $('#showPlace').hide();
    $('#reviews').hide();
  }
  findLocation(){
    let obs = this._httpService.giveLocation();
    this.location = obs;
    this.map.lat = this.location.lat;
    this.map.lng = this.location.lng;
    this.locationMarker.lat = this.location.lat;
    this.locationMarker.lng = this.location.lng;
    $('#loading').hide();
    $('#main').show();
    if(this.location.lat != ''){
      this.getCity();
    }else{
      $('#loading').show();
      setTimeout(()=>{ this.resetParameters()}, 3000);
    }
  }
  getCity(){
    var key = "&key="+this.key;
    var location = "latlng="+this.locationMarker.lat+","+this.locationMarker.lng;
    var url = location+key;
    var x = this._httpService.getCity(url);
    x.subscribe((data:any)=>{
      var city =JSON.parse(data);
      this.location.city = city.results[0].address_components[2].long_name;
      console.log('location' , this.location);
    });
  }
  hideStuff(){
    $('#main').hide();
    $('#location').hide();
    $('#error').hide();
  }
  getRandomDesign(){
    var font = this.getFont();
    $("h1").css("font-family" , font);
    var color = this.getColor();
    $("h1").css("color" , color);
    $(".icon").css("color" , color);
    $("#shell").css("color" , color);
    $("#shell").css("font-family" , font);
    $("#shell").css("border-left" , "0.5vw solid" + color);
    $("#shell").css("border-right" , "0.5vw solid" + color);
    $("#shell").css("border-top" , "0.5vh solid" + color);
    $("#shell").css("border-bottom" , "0.5vw solid" + color);
    $("button").css("color" , color);
    $(".big").css("border-right" , "0.5px solid" + color);
    $(".home").css("border-right" , "0.5px solid" + color);
    $('#reviewWindow').css("background-color", color);
    this.random.color = color;
    var font_two = this.getFont();
    $("#main").css("font-family" , font_two);
    var color_two = this.getColor();
    $("#shell").css("background-color" , color_two);
    $("a").css("background-color" , color_two);
    var font_three = this.getFont();
    var color_three = this.getColor();
    $("option").css("color" , color_three);
    $("option").css("font-family" , font_three);
  }
  getFont(){
    var fonts = [
      'Pacifico', 
      'Oswald', 
      'Lobster',
      'Roboto', 
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
    var key = "&key="+this.key;
    var location = "location="+this.locationMarker.lat+","+this.locationMarker.lng; 
    var radius = "&radius="+this.input.radius;
    var type = "&types="+this.input.type;
    this.random.url = location+radius+type+key;
    var x = this._httpService.getPlaces(this.random.url)
    x.subscribe((data:any)=>{
      this.random.places =JSON.parse(data);
      if(this.random.places.results.length == 0){
        $('#adjustRadius').show();
      }else{this.getPlace();}
    });
    this.getRandomDesign();
  }
  getPlace(){
    var number = this.random.places.results.length;
    var random = Math.floor((Math.random() * number));
    var place = this.random.places.results[random];
    console.log('place', place)
    this.place.received = true;
    this.place.name = place.name;
    this.place.icon = place.icon;
    this.place.lat = place.geometry.location.lat;
    this.place.lng = place.geometry.location.lng;
    this.placeMarker.lat = this.place.lat;
    this.placeMarker.lng = this.place.lng;
    this.placeMarker.visible = true;
    this.place.price_level = place.price_level;
    this.place.vicinity = place.vicinity;
    this.map.zoom = 12;
    console.log('this.place,' , this.place)
    $('#showInputs').hide();
    $('#showPlace').show();
  }
  getReviewPlace(review){
    this.place.received = true;
    this.place.name = review.place;
    this.place.icon = review.icon;
    this.place.lat = review.lat;
    this.place.lng = review.lng;
    this.place.vicinity = review.vicinity;
    this.map.zoom = 12;
    console.log('this.place,' , this.place);
    $('#showInputs').hide();
    $('#showPlace').show();
    this.showReviews = false;
  }
  getDirection() {
    this.placeMarker.visible = false;
    this.dir.origin = { lat: this.location.lat, lng: this.location.lng };
    this.dir.destination = { lat: this.place.lat, lng: this.place.lng };
    this.dir.visible = true;
    this.place.went = true;
    this.getRandomDesign();
  }

  tryAgain(){
    this.removeDirection();
    $('#showPlace').hide();
    $('#showInputs').show();
    this.place.lat = 0;
    this.place.lng = 0;
    this.resetParameters();
  }
  getDirections(){
    window.location.href = 'https://www.google.com/maps/dir/?api=1&origin='+this.locationMarker.lat+','+this.locationMarker.lng+'&destination='+this.place.lat+','+this.place.lng+'&travelmode=walking';
  }
  resetParameters(){
    $('#showPlace').hide();
    $('#showInputs').show();
    this.hideStuff();
    this.findLocation();
    this.input.radius = 0;
    this.input.type = '';
    this.input.intro = 0;
    this.place.went = false;
    this.reviewForm = false;
    this.showReviews = false;
    this.getRandomDesign();
  }
  smallquestionPopup(){
    var s = 'smallquestionPopup'
    var popup = document.getElementById(s);
    popup.classList.toggle("show");
  
  }
  bigQuestionPopup(){
    var b = 'bigQuestionPopup'
    var popup = document.getElementById(b);
    popup.classList.toggle("show");
  }
  loadingPopup(){
    var l = 'loadingPopup'
    var popup = document.getElementById(l);
    popup.classList.toggle("show");
  } 
  addReview(){
    this.reviewForm = true;
    this.review.city = this.location.city;
    this.review.place = this.place.name;
    this.review.icon = this.place.icon;
    this.review.lat = this.place.lat;
    this.review.lng = this.place.lng;
    this.review.vicinity = this.place.vicinity;
  }
  newReview(){
    this.removeDirection();
    this.place.lat = 0;
    this.place.lng = 0;
    let obs = this._httpService.addReview(this.review);
    obs.subscribe(data=>{
      this.review = {user: '', text: '', place: '', city: '', icon: '', lat: '', lng: '', vicinity: ''};
      this.showReviewWindow();
    });
  }
  getReviews(){
    let obs = this._httpService.getReviews(this.location.city);
    obs.subscribe(data=>{
      this.reviews = data;
    });
  }
  showReviewWindow(){
    $('#showInputs').hide();
    $('#showPlace').show();
    this.place.went = false;
    this.reviewForm = false;
    this.showReviews = true;
    this.getReviews();
  }
  modalHide(){
    $(".modal").css("display" , "none");
  }
  removeDirection(){
    this.dir.visible = false;
  }
}

