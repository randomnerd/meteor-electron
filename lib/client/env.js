(function(){
    var result, ipc;
    if(typeof require === 'function'){
        ipc = require('ipc');
    }

    Meteor.isDesktop = ipc ? ipc.sendSync('meteor-is-desktop') : false;
})();