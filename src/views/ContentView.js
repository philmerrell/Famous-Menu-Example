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
        //_setFlipperListener.call(this);
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
          backgroundColor: '#ccc',
          borderBottom: '2px solid #F1632A'
        }
      });

      var backgroundModifier = new StateModifier({
        transform: Transform.behind
      });

      this.menuIconSurface = new Surface({
        size: [60, 44],
        content: '<i class="fa fa-bars"></i>',
        properties: {
          fontSize: '30px',
          color: '#fff'
        }
      });

      var menuIconModifier = new StateModifier({
        transform: Transform.translate(10, 4, 0),
        origin: [0, 0.5],
        align: [0, 0.5]
      });

      var logoSurface = new Surface({
        size: [44,33],
        content: '<i class="fa fa-rebel"></i>',
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
            color: 'red'
          }
      });

        // this.flipper = new Flipper();
        //
        // this.rebelSurface = new Surface({
        //     size : [200, 200],
        //     content: '<i class="fa fa-rebel"></i>',
        //     properties: {
        //       backgroundColor: 'red',
        //       fontSize: '45px',
        //       textAlign: 'center',
        //       color: '#fff'
        //     }
        // });
        //
        // var empireSurface = new Surface({
        //     size : [200, 200],
        //     content: '<i class="fa fa-empire"></i>',
        //     properties: {
        //       backgroundColor: 'blue',
        //       color: '#fff',
        //       fontSize: '45px',
        //       textAlign: 'center'
        //     }
        // });

        // this.flipper.setFront(this.rebelSurface);
        // this.flipper.setBack(empireSurface);

        //this.bodySurface.add(flipper);

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

    function _setFlipperListener() {
      var toggle = false;
      this.rebelSurface.on('click', function(){
          var angle = toggle ? 0 : Math.PI;
          this.flipper.setAngle(angle, {curve : 'easeOutBounce', duration : 500});
          toggle = !toggle;
      }.bind(this));
    }

    module.exports = ContentView;
});
