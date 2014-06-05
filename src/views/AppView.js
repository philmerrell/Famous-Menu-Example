define(function(require, exports, module) {

    var View            = require('famous/core/View'),
        Surface         = require('famous/core/Surface'),
        Transform       = require('famous/core/Transform'),
        StateModifier   = require('famous/modifiers/StateModifier'),
        Modifier        = require('famous/core/Modifier'),
        Easing          = require('famous/transitions/Easing'),
        Transitionable  = require('famous/transitions/Transitionable'),
        GenericSync     = require('famous/inputs/GenericSync'),
        MouseSync       = require('famous/inputs/MouseSync'),
        TouchSync       = require('famous/inputs/TouchSync'),
        MenuView        = require('views/MenuView'),
        ContentView     = require('views/ContentView'),
        MenuData        = require('data/MenuData');

    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

    function AppView() {
        View.apply(this, arguments);

        this.menuOpen = false;
        this.contentViewPos = new Transitionable(0);

        _createMenuView.call(this);
        _createContentView.call(this);

        _setListeners.call(this);
        _handleSwipe.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;
    AppView.prototype.toggleMenu = function() {

      if(this.menuOpen) {
        this.hideMenu();

      } else {
        this.showMenu();
        this.menuView.resetMenuItems();
        this.menuView.animateMenuItems(0, 0);
      }

    };

    AppView.prototype.hideMenu = function() {

      this.contentViewPos.set(0, this.options.menu.transition, function() {
        this.menuOpen = false;
      }.bind(this));

    };

    AppView.prototype.showMenu = function() {
      this.contentViewPos.set(this.options.menu.openPosition, this.options.menu.transition, function() {
        this.menuOpen = true;
      }.bind(this));
    };

    AppView.DEFAULT_OPTIONS = {
      menu: {
        openPosition: 276,
        transition: {
          duration: 300,
          curve: 'easeOut'
        },
        posThreshold: 138,
        velThreshold: 0.75
      }
    };

    _createMenuView = function() {

      this.menuView = new MenuView({ menuData: MenuData });

      var menuModifier = new StateModifier({
        transform: Transform.behind
      });

      this.add(menuModifier).add(this.menuView);

    };

    _createContentView = function() {

      this.contentView = new ContentView();
      this.contentModifier = new Modifier({
        transform: function() {
          return Transform.translate(this.contentViewPos.get(), 0, 0);
        }.bind(this)
      });

      this.add(this.contentModifier).add(this.contentView);

    };

    _setListeners = function() {
      this.contentView.on('menuToggle', this.toggleMenu.bind(this));
    };

    _handleSwipe = function() {

      var sync = new GenericSync(
        ['mouse', 'touch'],
        { direction : GenericSync.DIRECTION_X }
      );

      this.contentView.pipe(sync);

      sync.on('update', (function(data) {
        var currentPos = this.contentViewPos.get();

        if(currentPos === 0 && data.velocity > 0) {
          //this.menuView.animateMenu();
        }

        this.menuView.dragOpenMenuAnimation(currentPos, this.options.menu.openPosition);

        this.contentViewPos.set(Math.max(0, currentPos + data.delta));

      }).bind(this));

      /* Since we want the menu to respond to either a flick or a slide,
         we need to set up the conditions to open or close the menu when the
         user's touch (or mouse) is heard.
         Taking into account */
      sync.on('end', (function(data) {

        var velocity = data.velocity;
        var position = this.contentViewPos.get();

        if(this.contentViewPos.get() > this.options.menu.posThreshold) {

          if(velocity < -this.options.menu.velThreshold) {

            this.hideMenu();
            //this.menuView.animateMenuItems(0, 0);

          } else {

            this.showMenu();
            this.menuView.animateMenuItems(this.options.menu.openPosition, this.options.menu.openPosition);
          }

        } else {

          if(velocity > this.options.menu.velThreshold) {

            this.showMenu();
            this.menuView.animateMenuItems(this.options.menu.openPosition, this.options.menu.openPosition);

          } else {

            this.hideMenu();
            //this.menuView.animateMenuItems(0, 0);

          }
        }
      }).bind(this));
    };

    module.exports = AppView;
});
