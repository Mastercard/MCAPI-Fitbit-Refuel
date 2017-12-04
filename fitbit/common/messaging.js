import * as messaging from 'messaging';
import { MAX_BUFFER } from './constants';

export function Messaging(){
  var self = this;
  this.msgq = [];

  messaging.peerSocket.onopen = function() {
    // Ready to send or receive messages
    console.log('Socket opened');
  };

  messaging.peerSocket.onerror = function(err) {
    console.error(`Connection error: ${err.code} - ${err.message}`);
  };

  messaging.peerSocket.onbufferedamountdecrease = function() {
    // Amount of buffered data has decreased, continue sending data
    if(self.msgq.length > 0) {
      self.sendMessage(self.msgq[0]);
      self.msgq.shift(); //remove the first element
    }
  };
}


Messaging.prototype.sendMessage = function(data){
  if (this.isReady()) {
    //make sure we don't overload the buffer. If over MAX_BUFFER bytes, 
    //queue the message to be sent later
    if (messaging.peerSocket.bufferedAmount < MAX_BUFFER) {
      messaging.peerSocket.send(data);
    }
    else{
      this.msgq.push(data);
    }
    return true;
  }
  else{
    console.warn('Unable to send message to Companion because peersocket is not ready');
    return false;
  }
};

Messaging.prototype.isReady = function(){
  return messaging.peerSocket.readyState === messaging.peerSocket.OPEN;
}

Messaging.prototype.handleOnMessage = function(handler){
  // Listen for the onmessage event
  messaging.peerSocket.onmessage = function(evt) {    
    if(!evt.data){
      console.error('Received message with no data');
      return;
    }
    handler(evt.data);
  };
}
