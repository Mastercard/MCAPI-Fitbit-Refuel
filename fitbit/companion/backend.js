//back end server
export function Backend(){
  this.AccessKey = '';
  this.BaseUrl = '';
}

Backend.prototype.getNearbyMerchants = function(ind,lat, lon) {
  const url = `${this.BaseUrl}/places?lat=${lat}&lng=${lon}&key=${this.AccessKey}&industry=${ind}`;
  console.log('Fetching ' + url);
  return fetch(url).then( (response) => {
    const json = response.json();
    console.log('Fetched nearby merchants size: ', json.length);
    return json;
  }).catch( (error) => {
    console.error('Error fetching merchants', error);
  });
}
  
Backend.prototype.getMap = function(lat, lon, targetloc){
  const url = `${this.BaseUrl}/map?origin=${lat},${lon}&destination=${targetloc}&key=${this.AccessKey}`;
  console.log('Fetching ' + url);
  return fetch(url).then( (response) => {
    console.log('Companion got response for getMap');
    const buf = response.arrayBuffer();
    return buf;
  }).catch( (error) => {
    console.error('Error fetching getMap', error);
  });
}

Backend.prototype.getNearestMerchantMap = function(lat, lon, industry){
  const url = `${this.BaseUrl}/map?origin=${lat},${lon}&industry=${industry}&key=${this.AccessKey}`;
  console.log('Fetching ' + url);
  return fetch(url).then( (response) => {
    console.log('Companion got response for getNearestMerchantMap');
    const buf = response.arrayBuffer();
    return buf;
  }).catch( (error) => {
    console.error('Error fetching getNearestMerchantMap', error);
  });
}
