var ipc = require('ipc');
/* Display Startup Info */

window.addEventListener('load', function(){
  var reset = false, hasStarted = false, status = document.querySelector('.status');
  var message = document.querySelector('.meteor');

  /* Disclaimer: I was tired when I applied the reset-message logic below so I don't know how it works */

  status.innerText = false;

  // Print meteor startup info
  ipc.on('stdout', function(msg, starting){
    if(starting && !reset)
      message.innerText += msg;
    else{
      message.innerText = msg;
      reset = false;
      hasStarted = false; /* Reset all of the resets when reset */
    }
  });

  // Listen for Meteor Status
  ipc.on('meteor-has-started', function(started){
    if(started){
      status.innerText = true;
      hasStarted = true;
    }
    else{
      status.innerText = false;
      reset = hasStarted ? true : false;
    }
  });
});