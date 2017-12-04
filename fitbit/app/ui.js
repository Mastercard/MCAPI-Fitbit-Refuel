import document from 'document';
export default function UI(){
   
  this.MAX_MER = 5;
  this.merchantTiles = [];
  
  for(var i=0;i<this.MAX_MER;i++){
    this.merchantTiles.push(document.getElementById('tile-'+i));
  }
  
}

const refresh = document.getElementById('refresh');
const food = document.getElementById('food');
const pharmacies = document.getElementById('pharmacies');
const sportingGoods = document.getElementById('sportingGoods');
const homeScreen = document.getElementById('homeScreen');
const messageScreen = document.getElementById('message');
const merchantScreen = document.getElementById('merchantScreen');
const mapScreen = document.getElementById('mapScreen');
const listHeader = document.getElementById('headText');
const messageIcon = document.getElementById('messageicon');
const messageAnimation = document.getElementById('messageanimation');
const staticMessageIcon = document.getElementById('staticmessageicon');
const mapMerchant =  document.getElementById('mapMerchant');
const mapDist =  document.getElementById('mapDistance');
const mapImg = document.getElementById('mapimg');

let currentScreen = homeScreen;
let loadedScreens = [];
let messageShown = false;

UI.prototype.handleFoodButtonClick = function(handler){
  food.onclick = handler;
}

UI.prototype.handleRefreshButtonClick = function(handler){
  refresh.onclick = handler;
}

UI.prototype.handlePharmacyButtonClick = function(handler){
  pharmacies.onclick = handler;
}

UI.prototype.handleSportsButtonClick = function(handler){
  sportingGoods.onclick = handler;
}

UI.prototype.handleMerchantClick = function(handler){
 
  for(var i=0;i<this.MAX_MER;i++){
    const tile = this.merchantTiles[i];
    const rect = tile.getElementById('merclick');
    
    rect.onclick = ((i) => {
      return ()=>{
        handler(i);
      };
    })(i);
    
  }
}

UI.prototype.handleKeyBehavior = function(downHandler, upHandler){
  document.onkeypress = function(e) {    
    if(e.key == 'back' && (currentScreen !== homeScreen || messageShown)){
      messageShown = false;
      e.preventDefault();
      currentScreen = loadedScreens.pop() || homeScreen;
      hideAllScreens();
      currentScreen.style.display = 'inline';
    }
    if(e.key == 'down'){
      e.preventDefault();
      downHandler();
    }
    if(e.key == 'up'){
      e.preventDefault();
      upHandler();
    }
  }
}

UI.prototype.showMessage = function(message, disableAnimation){
  hideAllScreens();  

  if(disableAnimation){
    messageIcon.style.display = "none;"
    messageAnimation.style.display = "none";
    staticMessageIcon.style.display="inline";
  }
  else{
    messageIcon.style.display = "inline;"
    messageAnimation.style.display = "inline";
    staticMessageIcon.style.display="none";   
  }

  messageScreen.text= message;
  messageScreen.style.display="inline";
  messageShown = true;
}

UI.prototype.showPhoneDisconnected = function(message){
  hideAllScreens();
  messageScreen.text= message;
  messageIcon.style.display = "none;"
  messageAnimation.style.display = "none";
  staticMessageIcon.style.display="inline";
  messageScreen.style.display="inline";
  messageShown = true;
}

UI.prototype.hidePhoneDisconnected = function(message){
  hideLoading();
  messageShown = false;
}

UI.prototype.showMerchants = function(title,merchants){
  hideAllScreens();
  listHeader.text=title;
  
  for(var i=0;i<this.MAX_MER;i++){
    const tile = this.merchantTiles[i];
    const data = merchants[i];
    
    if(data){
      tile.getElementById('mname').text=data['name'];
      tile.getElementById('mloc').text=data['addr'];
      tile.getElementById('mdis').text = data['dist']+'m';
      tile.style.display = 'inline';

    }else{
      tile.style.display = 'none';
    }
    
  }
  
  merchantScreen.style.display = 'inline';
  setCurrentScreen(merchantScreen);
}

UI.prototype.showMap = function(name,dis,filename){
  hideAllScreens();
  setMapText(name,dis);
  mapImg.href = filename;

  mapScreen.style.display = 'inline';
  setCurrentScreen(mapScreen);
}

function setMapText (name, distance){
  mapMerchant.text = name;
  mapDist.text = distance+'m';
}

function hideAllScreens(){
  hideLoading();
  hideHomeScreen();
  hideMerchantScreen();
  hideMapScreen();
}

function hideHomeScreen(){
  homeScreen.style.display = 'none';
}

function hideLoading(){
  messageScreen.style.display = 'none';
  messageShown = false;
}

function hideMerchantScreen(){
  merchantScreen.style.display = 'none';
}

function hideMapScreen(){
  mapScreen.style.display = 'none';
}

function setCurrentScreen(screen){
  loadedScreens.push(currentScreen);
  currentScreen = screen;
}

