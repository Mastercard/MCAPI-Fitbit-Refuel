/*
 * Entry point for the watch app
 */
import { Messaging } from '../common/messaging';
import { Location } from '../common/location';
import UI from './ui';
import { FOOD, DRINKS, HEALTHCARE, SPORTS, SETTINGS, IND, getIndKeyByValue } from '../common/constants';
import * as fs from 'fs';
import { inbox } from 'file-transfer';


console.log('MC Refuel App startup ');

const MessagingSvc = new Messaging();
const WatchUI = new UI();
const LocationSvc = new Location();
const labels = {
  [FOOD]:"Food",
  [HEALTHCARE]:"Pharmacies",
  [DRINKS]: "Refreshments",
  [SPORTS]: "Sporting Goods"
};

let isMockData = false;
let isMockLocation = false;
let mockTimeOut = 1000;
let mockLatitude = 40.730071;
let mockLongitude =  -74.010334;

let merchantData = [];
let selectedId = -1;
let currentPosition=null;

let selectedMerchantName = '';
let selectedMerchantDist = 0;

function getMerchantData(type){
  showLoading();
  if(isMockData){

    const merchantData = getMOCKMerchantData(type);
    setTimeout(function(){
      renderMerchants(type,merchantData);
    },mockTimeOut);
    return;
  }

  const onLocationSuccess = (location) => {
    const msg = {
      type: type,
      currentlat: location.coords.latitude,
      currentlon: location.coords.longitude
    };
  
    const res = MessagingSvc.sendMessage(msg);
    if(!res){
      showPhoneDisconnected();
    }
  };
  
  getLocation(onLocationSuccess);
  
}

function getMOCKMerchantData(type){

  let data;

  switch(type){
    case HEALTHCARE:
      data = [{"name":"Rite Aid Store - 1225","dist":596,"addr":"534 HUDSON ST  FRNT A","latlng":"40.734287,-74.00597"},{"name":"Cvs/pharmacy #02435","dist":728,"addr":"75 CHRISTOPHER ST  FRNT 3","latlng":"40.733691,-74.003146"},{"name":"Cvs/pharmacy #02058","dist":896,"addr":"158 BLEECKER ST","latlng":"40.728416,-73.999941"},{"name":"Ansonia Pharma07791650","dist":1132,"addr":"446 AVENUE OF THE AMERICAS","latlng":"40.734845,-73.998482"},{"name":"Duane Reade #14260","dist":1331,"addr":"77 7TH AVE  FRNT 3","latlng":"40.738617,-73.999305"}];
      break;
    case FOOD:
      data = [{"name":"Little Italy Pizza & D","dist":506,"addr":"180 VARICK ST  STE A","latlng":"40.727513,-74.005379"},{"name":"Mcnultys Teacoffee","dist":572,"addr":"109 CHRISTOPHER ST","latlng":"40.733324,-74.005089"},{"name":"Ghandi Cafe Inc","dist":628,"addr":"283 BLEECKER ST  FRNT 1","latlng":"40.731925,-74.003298"},{"name":"Silver Spurs","dist":944,"addr":"490 LAGUARDIA PL","latlng":"40.727124,-73.999837"},{"name":"Fanelli's Cafe","dist":1156,"addr":"94 PRINCE ST  APT 1","latlng":"40.724571,-73.998706"}];
      break; 
    case DRINKS:
      data = [{"name":"D'agostino #16","dist":853,"addr":"790 GREENWICH ST","latlng":"40.7372,-74.006633"},{"name":"Gristedes # 543","dist":752,"addr":"3 SHERIDAN SQ  FRNT 1","latlng":"40.732919,-74.00225"},{"name":"Myers Of Keswick","dist":1028,"addr":"634 HUDSON ST","latlng":"40.738494,-74.005328"},{"name":"Gnc #09109","dist":1185,"addr":"34 7TH AVE","latlng":"40.737693,-74.000525"},{"name":"Westside Supermarket","dist":1356,"addr":"77 7TH AVE  FRNT 2","latlng":"40.738907,-73.999267"}];
      break;
    case SPORTS:
      data = [{"name":"New York Waterfront","dist":308,"addr":"391 WEST ST  FRNT A","latlng":"40.732833,-74.010136"},{"name":"Arc'teryx New York","dist":918,"addr":"169 SPRING ST","latlng":"40.72476,-74.002015"},{"name":"Rapha Cycle Club Nyc","dist":897,"addr":"159 PRINCE ST","latlng":"40.72599,-74.001171"},{"name":"The North Face 18","dist":1009,"addr":"139 WOOSTER ST","latlng":"40.725773,-73.999801"},{"name":"Nike Soho 325","dist":1230,"addr":"529 BROADWAY","latlng":"40.723237,-73.998875"}];
      break;
  }

  return data;

}

var onFoodClick = function(){
  getMerchantData(FOOD);
}

var onRefreshmentClick = function(){
  getMerchantData(DRINKS);
}

var onPharmaciesClick = function(){
  getMerchantData(HEALTHCARE);
}

var onSportsClick = function(){
  getMerchantData(SPORTS);
}

var onMerchantClick = function(id){
  showLoading();
  
  selectedMerchantName = merchantData[id].name;
  selectedMerchantDist = merchantData[id].dist;
  
  if(isMockData){
    showLoading();
    setTimeout(() => {
       renderMap("sample_map.jpg");
    }, mockTimeOut);
    return false;
  }
  
  console.log(id,JSON.stringify(merchantData[id]));

  const onLocationSuccess = (location) => {
    const msg = {
      type: 'maps',
      currentlat: location.coords.latitude,
      currentlon: location.coords.longitude,
      targetloc: merchantData[id].latlng,
      targetname: merchantData[id].name
    };
  
    const res = MessagingSvc.sendMessage(msg);
    if(!res){
      showPhoneDisconnected();
    }
  };

  getLocation(onLocationSuccess);
}

function setSelectedFavoriteMerchant(industryName){
  selectedMerchantName = 'Nearest ' + industryName;
  selectedMerchantDist = '~500';
}

const handleFavoriteKey = function(industry){
  return function(){
    setSelectedFavoriteMerchant(industry);
    showLoading();
    if(isMockData){ 
      console.log('MOCK quickmap industry:' + IND[indusrtry] );
      setTimeout(function(){
        renderMap(`sample_map_${industry}.jpg`);
      },mockTimeOut * 2);
      return;
    }

    const onLocationSuccess = (location) => {
      const msg = {
        type: 'quickmap',
        currentlat: location.coords.latitude,
        currentlon: location.coords.longitude,
        industry: IND[indusrtry],
      };

      const res = MessagingSvc.sendMessage(msg);
      if(!res){
        showPhoneDisconnected();
      }
    };

    getLocation(onLocationSuccess);
  }
}

function attachEvents(){
  WatchUI.handleFoodButtonClick(onFoodClick);
  WatchUI.handleRefreshButtonClick(onRefreshmentClick);
  WatchUI.handlePharmacyButtonClick(onPharmaciesClick);
  WatchUI.handleSportsButtonClick(onSportsClick);
  WatchUI.handleMerchantClick(onMerchantClick);
  WatchUI.handleKeyBehavior(handleFavoriteKey(FOOD), handleFavoriteKey(DRINKS));
}


function showLoading(){
   WatchUI.showMessage("Loading...");
}

function showLocationError(){
   WatchUI.showMessage("Unable to get your location", true);
}

function showPhoneDisconnected(){
   WatchUI.showPhoneDisconnected("No connection. Try again later");
   // Helpful to check whether we are connected or not.
   const phonedisinterval = setInterval(() => {
    console.log("Device Connected status=" + MessagingSvc.isReady());
    if(MessagingSvc.isReady()){
      clearInterval(phonedisinterval);
      WatchUI.hidePhoneDisconnected();
    }
   }, 3000);
}

function getLocation(successCallback){
  if(isMockLocation){
    successCallback({
      coords: {
        latitude: mockLatitude,
        longitude: mockLongitude
      }
    });
    
    return;
  }
  const errorCallback = (error) => {
    console.error("Cannot get location. Error: " + JSON.stringify(error));
    showLocationError();
  };
  
  
  if(currentPosition){
    successCallback(currentPosition);
  }
  else{
    //use Device location if Companion did not send a recent location over
    LocationSvc.fetchLocation(successCallback, errorCallback);
  }
}

//////
function handleSettings(key, value){
  switch(key){
    case 'mockdata':{
      isMockData = value==='true';          
      break;
    }
    case 'mockloc': {
      isMockLocation = value ==='true';
      break;
    }
    case 'mocklat': {
      mockLatitude = value;
      break;
    }
    case 'mocklong': {
      mockLongitude = value;
      break;
    }
    case 'mockTimeout': {
      mockTimeOut = value;
      break;
    }    
    default:
      console.error(`Unknown settings. Not handling ${key}: ${value}`);
  }
}
 MessagingSvc.handleOnMessage( (data) => {
  switch(data.type) {
    case 'location':
      //use phone's location because its much faster than device's GPS.
      currentPosition = {coords: {latitude: data.latitude, longitude: data.longitude}};
      break;
    case SETTINGS:
      handleSettings(data.payload.key, data.payload.value);
      break;
    case HEALTHCARE:
    case FOOD: 
    case DRINKS:
    case SPORTS:
         renderMerchants(data.type,data.payload);
      break;
    default: 
      console.log('Unknown message received', data);
  }
});

function renderMerchants(type,data){
  merchantData = data;
  WatchUI.showMerchants(labels[type],merchantData);
}

function renderMap(mapFile){ 
  WatchUI.showMap(selectedMerchantName, selectedMerchantDist, mapFile);
}

// Event occurs when new file(s) are received
checkFile(); //call once when app start to check any file already in the queue
inbox.onnewfile = function () {
  checkFile();
};

let prevfile = null;
function checkFile(){
  var filename;
  do {
    // If there is a file, move it from staging into the application folder
    filename = inbox.nextFile();
    if (filename) {      
      const fullpath = "/private/data/" + filename;
      
      //try to delete the older map files if it exists
      if(prevfile){
        fs.unlinkSync(prevfile);
      } 
      
      prevfile = fullpath;      
      logFileStat(fullpath);
      renderMap(fullpath);
    }
  } while (filename);
}

function logFileStat(filename){
  let stats = fs.statSync(filename);
  if (stats) {
    console.log("File size: " + stats.size + " bytes");
    console.log("Last modified: " + stats.mtime);
  }
  else{
    console.log(`Unable to show file stats for ${filename}`);
  }
}

attachEvents();
