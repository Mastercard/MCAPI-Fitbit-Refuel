import { geolocation } from 'geolocation';

export function Location(){

  this.watchId=null;
}

Location.prototype.fetchLocation = function (locationHandler, locationError) {
  const options =  {
    timeout: 10000, // 10 seconds
    maximumAge: 120000, //2 minutes cache
    enableHighAccuracy: false
  };

  geolocation.getCurrentPosition(locationHandler, locationError, options);
}

Location.prototype.watchLocation = function(locationHandler){
  this.watchId = geolocation.watchPosition(locationHandler, (error) => {
    console.error('Unable to watch location');
  });
}

Location.prototype.clearWatch = function(){
  if(this.watchId){
     geolocation.clearWatch(this.watchId);
  }
}