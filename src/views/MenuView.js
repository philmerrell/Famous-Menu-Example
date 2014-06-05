define(function(require, exports, module) {
    var View          = require('famous/core/View'),
        Surface       = require('famous/core/Surface'),
        Transform     = require('famous/core/Transform'),
        StateModifier = require('famous/modifiers/StateModifier'),
        Timer         = require('famous/utilities/Timer'),
        Easing        = require('famous/transitions/Easing'),
        MenuItem      = require('views/MenuItemView');

    var Scrollview = require("famous/views/Scrollview");


    function MenuView() {
        View.apply(this, arguments);

        _createMenuItems.call(this);

    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;
    MenuView.prototype.dragOpenMenuAnimation = function(currentPosition, openPosition) {
      var transition = this.options.transition;
      var topOffset = this.options.topOffset;
      var stripOffset = (currentPosition > openPosition) ? this.options.stripOffset : currentPosition / openPosition * this.options.stripOffset;


      for(var i = 0; i < this.menuItemModifiers.length; i++) {
        var yOffset = topOffset + stripOffset * i;
        this.menuItemModifiers[i].setTransform(Transform.translate(0, yOffset, 0));
      }

    };

    MenuView.prototype.resetMenuItems = function() {

      for(var i = 0; i < this.menuItemModifiers.length; i++) {

        this.menuItemModifiers[i].setTransform(Transform.translate(0,0,0));
      }
    };

    MenuView.prototype.animateMenuItems = function(currentPosition, openPosition) {

      var transition = this.options.transition;
      var delay = this.options.staggerDelay;
      //var stripOffset = this.options.stripOffset;
      var topOffset = this.options.topOffset;

      var stripOffset = (currentPosition >= openPosition) ? this.options.stripOffset : currentPosition / openPosition * this.options.stripOffset;

      for(var i = 0; i < this.menuItemModifiers.length; i++) {
        Timer.setTimeout(function(i) {
          var yOffset = topOffset + stripOffset * i;

          this.menuItemModifiers[i].setTransform(
            Transform.translate(0, yOffset, 0), transition);
        }.bind(this, i), i* delay);
      }

    };


    MenuView.DEFAULT_OPTIONS = {
      menuData: {},
      topOffset: 0,
      stripOffset: 58,
      staggerDelay: 35,
      transition: {
        duration: 300,
        curve: Easing.outBack
      }
    };

    _createMenuItems = function() {
      // used in _animateMenuItems()
      this.menuItemModifiers = [];

      var yOffset = this.options.topOffset;

      for(var i = 0; i < this.options.menuData.length; i++) {

        var menuItem = new MenuItem({
          iconFont: this.options.menuData[i].iconFont,
          title: this.options.menuData[i].title
        });

        var menuItemModifier = new StateModifier({
          transform: Transform.translate(0, yOffset, 0)
        });

        this.menuItemModifiers.push(menuItemModifier);
        this.add(menuItemModifier).add(menuItem);

        yOffset += this.options.stripOffset;

      }

    };

    module.exports = MenuView;
});
