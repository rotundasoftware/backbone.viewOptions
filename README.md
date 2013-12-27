# Backbone.ViewOptions

A mini [Backbone.js](http://backbonejs.org/) plugin for declaring view options. Supports required options and default values.

## Benefits

* Use a simple declarative syntax to attach initialization options directly to your view objects. 
* Declare required options as such, so an exception is raised immediately if one is not supplied.
* Declare default values for particular options.
* Can be used with any view class, including those in [Marionette](https://github.com/marionettejs/backbone.marionette), [LayoutManager](https://github.com/tbranyen/backbone.layoutmanager), etc.

## Usage

```javascript
// call Backbone.ViewOptions.attach in our base view constructor so that the
// Backbone.ViewOptions functionality is available in all our views.
BaseView = Backbone.View.extend( {
	constructor : function( options ) {
		Backbone.ViewOptions.attach( this, options );
		return Backbone.View.prototype.constructor.apply( this, arguments );
	}
} );

ButtonView = BaseView.extend( {
	options : [ "label" ]

	initialize : function() {
		// the options declared in the "options" property are
		// automatically attach to the view object itself.
		console.log( this.label );
	}
} );

// outputs "OK" to the console.
myButtonView = new ButtonView( { "label" : "OK" } );

WidgetView = BaseView.extend( {
	options : [
		"type!", // use a trailing explanation mark to indicate an option is required.
		{ name : "label", defaultValue : "OK" } // use this object syntax to give an option a default value.
	]

	render : function() {
		console.log( this.label );
	}
} );

// outputs "OK" to the console (because the "label" option defaults to "OK").
myWidgetView = new WidgetView( { "type" : "button" } ).render();

// throws an exception (because the required "type" option is missing).
myWidgetView = new WidgetView( { "label" : "Cancel" } ).render();
```

## Details

`Backbone.ViewOptions.attach()`, this simple plugin's only function, attaches elements of an options hash to a view, as specified by a declarative array of valid options (and associated information) that must be supplied on the view class. Use it in a view's constructor or initialize method like so:

```javascript
Backbone.ViewOptions.attach( this, options );
```

The function takes three arguments:

1. A view object to which the options should be attached.
2. The initialization options hash, exaclty as passed into the view's `constructor` or `initialize` method.
3. An optional third argument (defaults to `"options"`) that may be used to specify the name of the "option declarations" array.

The "option declarations" array should be supplied on the view class (just like, for example, the built-in backbone `events` property). Each element in the array must be a string or an object.
* A string element simply represents the name of an option that should be attached to the view. The name may optionally be followed by an explanation mark, which indicates a "required" option. If a required option is not supplied, an exception will be raised.
* An object element may be used to give an option a default value. Each object element should have two properties, "name" and "defaultValue", e.g. `{ name : "label", defaultValue : "OK" }`

(Note: You may also supply a function that returns an array for the "option declarations" property, similar to how a function that returns a hash may be supplied instead of a hash for the built-in backbone `events` property.)

The `Backbone.ViewOptions.attach()` method returns an array of the names of the options that are supplied in the "option declarations" array, in case you need an enumeration of the properties on the view object that correspond to initialization options.