import { me } from 'companion';
import { Backend } from './backend';
import { outbox } from 'file-transfer';
import { Messaging } from '../common/messaging';
import {FOOD, DRINKS, HEALTHCARE, SPORTS, SETTINGS, IND} from '../common/constants';
import { settingsStorage } from 'settings';
import { settings } from 'cluster';
import { Location } from '../common/location';
const LocationSvc = new Location();
const MessagingSvc = new Messaging();
const WatchBackend = new Backend();

console.log('MC Refuel Companion starting because ' + JSON.stringify(me.launchReasons));

// Helpful to check whether we are connected or not.
setInterval(() => {
  console.log(`MC Refuel Companion ( ${me.buildId} ) is running. Device connection status: ${MessagingSvc.isReady()}`);
  if(MessagingSvc.isReady()){
    LocationSvc.fetchLocation((position) => {
      MessagingSvc.sendMessage({type:'location', latitude: position.coords.latitude, longitude: position.coords.longitude});
    }, 
    (error) => console.log('Get location error:' + JSON.stringify(error)));
  }
}, 5000);

// Listen for the onmessage event
MessagingSvc.handleOnMessage((data) => {  
  switch(data.type) {
    case 'maps': {
      const {currentlat, currentlon, targetloc } = data;
      getMap(currentlat, currentlon, targetloc);
      break;
    }
    case 'quickmap': {
      const { currentlat, currentlon, industry } = data; 
      getNearestMerchant(currentlat, currentlon, industry);
      break;
    }  
    case HEALTHCARE: 
    case FOOD:
    case SPORTS:
    case DRINKS:    
      const {currentlat, currentlon} = data;
      getMerchantData(IND[data.type],data.type,currentlat, currentlon);
      break;
    default: 
      console.log('Unknown message received', data);
  }
});

let mapnum = 0;
function sendImage(data){
  if (MessagingSvc.isReady()) {    
    const destFilename = 'map' + mapnum + '.jpg';
    mapnum++; //increment file name because the device will not load files with existing name
    outbox.enqueue(destFilename, data).then( (ft) => {
      // Queued successfully
      console.log('Transfer of ' + destFilename + ' successfully queued.');
    }).catch( (error) => {      
      console.error('Failed to queue ' + destFilename + '  Error: ' + JSON.stringify(error));
    });
  }
  else{
    console.log('Unable to send map because peersocket ReadyState is not ready');
  }
}

function getMap(lat, lon, targetloc){
  WatchBackend.getMap(lat, lon, targetloc).then((data) => {
      sendImage(data);
    }).catch((error) => {
      console.error('Fetching failed. Error: ' + JSON.stringify(error));
      MessagingSvc.sendMessage({type: 'sendmap', loading: false, error: 'Unable to display map'});
    });
}

function getNearestMerchant(lat, lon, industry) {
  WatchBackend.getNearestMerchant(lat, lon, industry).then((data) => {
      sendImage(data);
    }).catch((error) => {
      console.error('Fetching failed. Error: ' + JSON.stringify(error));
      MessagingSvc.sendMessage({type: 'sendmap', loading: false, error: 'Unable to display map'});
    });
}

function getMerchantData(ind,type,lat, lon){
  WatchBackend.getNearbyMerchants(ind,lat, lon).then((res) => {
    sendMerchantData(type,res);
  });
}

const sendMerchantData = function (type,res){
    const msg = {type: type, payload: res.data};
    MessagingSvc.sendMessage(msg);
}

// Event fires when a setting is changed
settingsStorage.onchange = function(evt) {
  const settingsKey = evt.key;
  handleSettingsData(settingsKey,  evt.newValue);

}

function handleSettingsData(key, value){
  console.log(`sending settings key ${key}: ${value}`);
  //Companion Settings
  switch(key){
    case 'baseurl':{
      WatchBackend.BaseUrl = value;
      return;
    }
    case 'accesskey':{
      WatchBackend.AccessKey = value;
      return;
    }
  } 
  
  //Device settings - sendMessage to device
  const msg = {type: SETTINGS, payload: {'key': key, 'value': value}};
  MessagingSvc.sendMessage(msg);
}
