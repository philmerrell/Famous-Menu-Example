define(function(require, exports, module) {

    var Engine = require('famous/core/Engine'),
        AppView = require('views/AppView'),
        mainContext = Engine.createContext(),
        Surface = require('famous/core/Surface'),
        appView = new AppView();

        var appBg = new Surface({
          size: [undefined, undefined],
          properties: {
            backgroundColor: '#09347A'
          }
        });

        //appView.add(appBg);

    mainContext.add(appView);

});
