define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    function MenuItemView() {
        View.apply(this, arguments);

        _createBackground.call(this);
        _createIcon.call(this);
        _createTitle.call(this);
    }

    MenuItemView.prototype = Object.create(View.prototype);
    MenuItemView.prototype.constructor = MenuItemView;

    MenuItemView.DEFAULT_OPTIONS = {
      width: undefined,
      height: 55,
      iconSize: 32,
      iconFont: '<i class="fa fa-rebel"></i>',
      title: 'Rebel Alliance'
    };

    _createBackground = function() {
      var backgroundSurface = new Surface({
        size: [this.options.width, this.options.height],
        properties: {
          backgroundColor: 'black',
          boxShadow: '0 0 1px black'
        }
      });

      this.add(backgroundSurface);

    };

    _createIcon = function() {

      var iconSurface = new Surface({
        size: [this.options.iconSize, this.options.iconSize],
        content: this.options.iconFont,
        pointerEvents: 'none',
        properties: {
          color: '#fff',
          fontSize: '30px'
        }
      });

      var iconModifier = new StateModifier({
        transform: Transform.translate(10, 10, 0)
      });

      this.add(iconModifier).add(iconSurface);

    };

    _createTitle = function() {

      var titleSurface = new Surface({
          size: [true, true],
          content: this.options.title,
          properties: {
              color: 'white',
              fontFamily: 'AvenirNextCondensed-DemiBold',
              fontSize: '25px',
              textTransform: 'uppercase',
              pointerEvents : 'none'
          }
      });

      var titleModifier = new StateModifier({
          transform: Transform.translate(55, 10, 0)
      });

      this.add(titleModifier).add(titleSurface);

    };

    module.exports = MenuItemView;
});
