define(function(require, exports, module) {
    var View          = require('famous/core/View'),
        Surface       = require('famous/core/Surface'),
        Transform     = require('famous/core/Transform'),
        StateModifier = require('famous/modifiers/StateModifier'),
        HeaderFooter  = require('famous/views/HeaderFooterLayout'),
        ImageSurface  = require('famous/surfaces/ImageSurface'),
        Flipper    = require("famous/views/Flipper"),
        FastClick     = require('famous/inputs/FastClick');

    function ContentView() {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createBacking.call(this);
        _setListeners.call(this);
    }

    ContentView.prototype = Object.create(View.prototype);
    ContentView.prototype.constructor = ContentView;

    ContentView.DEFAULT_OPTIONS = {
      headerSize: 44
    };

    function _createLayout() {

      this.layout = new HeaderFooter({
        headerSize: this.options.headerSize
      });

      var layoutModifier = new StateModifier({
        transform: Transform.translate(0,0,0.1)
      });

      this.add(layoutModifier).add(this.layout);

    }

    function _createHeader() {
      var backgroundSurface = new Surface({
        properties: {
          backgroundColor: '#798e7b',
          borderBottom: '3px solid #3a2d1d'
        }
      });

      var backgroundModifier = new StateModifier({
        transform: Transform.behind
      });

      this.menuIconSurface = new Surface({
        size: [60, 40],
        content: '<i class="fa fa-bars"></i>',
        properties: {
          fontSize: '25px',
          color: '#3a2d1d'
        }
      });

      var menuIconModifier = new StateModifier({
        transform: Transform.translate(10, 4, 0),
        origin: [0, 0.5],
        align: [0, 0.5]
      });

      var logoSurface = new ImageSurface({
        size: [40,40],
        content: 'img/logo.png',
        properties: {
          fontSize: '30px',
          color: 'red'
        }
      });

      var logoModifier = new StateModifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
      });

      this.layout.header.add(menuIconModifier).add(this.menuIconSurface);
      this.layout.header.add(logoModifier).add(logoSurface);
      this.layout.header.add(backgroundModifier).add(backgroundSurface);
    }


    function _createBody() {

      this.bodySurface = new Surface({
          size : [undefined, undefined],
          content: 'Drag Here.',
          properties: {
            backgroundColor: 'white',
            fontSize: '45px',
            textAlign: 'center',
            color: '#424e5a'
          }
      });


      this.bodySurfaceModifier = new StateModifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5]
      });

      this.layout.content.add(this.bodySurfaceModifier).add(this.bodySurface);

    }

    function _createBacking() {
        var backing = new Surface({
            properties: {
                backgroundColor: 'blue',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }
        });

        this.add(backing);
    }

    function _setListeners() {
      this.menuIconSurface.on('click', function() {
        this._eventOutput.emit('menuToggle');
      }.bind(this));

      this.bodySurface.pipe(this._eventOutput);
    }

    module.exports = ContentView;
});
