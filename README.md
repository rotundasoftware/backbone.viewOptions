# Backbone.ViewOptions

A mini [Backbone.js](http://backbonejs.org/) plugin to take care of your view options. Supports required options and default values.

## Benefits

* Use a simple declarative syntax to attach white-listed initialization options directly to your view objects. 
* Declare required options as such, so an exception is raised immediately if one is not supplied.
* Declare default values for particular options.
* Option values can be changed post-initialization through a public `view.setOptions()` method.
* Can be used with any view class, including those in [Marionette](https://github.com/marionettejs/backbone.marionette), etc.

## Usage

```javascript
// Call Backbone.ViewOptions.add() in our base view constructor so
// that the view options functionality is added to all our views.
BaseView = Backbone.View.extend( {
	constructor : function( options ) {
		Backbone.ViewOptions.add( this, options ); // adds view options functionality and attaches options
		return Backbone.View.prototype.constructor.apply( this, arguments );
	}
} );

ButtonView = BaseView.extend( {
	options : [ "label" ]

	initialize : function() {
		// The options declared in the "options" property are
		// automatically attach to the view object itself.
		console.log( this.label );
	}
} );

// Outputs "OK" to the console.
myButtonView = new ButtonView( { "label" : "OK" } );

WidgetView = BaseView.extend( {
	options : [
		"type!", // Use a trailing explanation mark to indicate an option is required.
		{ name : "label", defaultValue : "OK" } // Use this object syntax to give an option a default value.
	]

	render : function() {
		console.log( this.label );
	}
} );

// Outputs "OK" to the console, because the "label" option defaults to "OK".
myWidgetView = new WidgetView( { "type" : "button" } ).render();
myWidgetView.setOptions( { "label" : "Save" } );
myWidgetView.render(); // Outputs "Save" to the console.

// Throws an exception, because the required "type" option is missing.
myOtherWidgetView = new WidgetView( { "label" : "Cancel" } ).render();
```

## Methods

#### Backbone.ViewOptions.add( view, optionHash )

Adds the view options functionality to a view object. Use it in a view's (or your base view's) `constructor` or `initialize` method:

```javascript
initialize : function( options ) {
	Backbone.ViewOptions.add( this, options );
	...
}
```

The two arguments are:

1. A view object to which the the view options functionality should be added.
2. The initialization options hash, as passed into the view's `constructor` or `initialize` method.

An "option declarations" array should be supplied as the `options` property of the view class (just like, for example, the built-in backbone `events` property). Each element in the array must be a string or an object.
* A string element simply represents the name of an option that should be attached to the view when it is supplied in the `optionsHash`. The name may optionally be followed by an explanation mark, which indicates a "required" option. If a required option is not supplied, an exception will be raised.
* An object element may be used to give an option a default value. Each object element should have two properties, `name` and `defaultValue`, e.g. `{ name : "label", defaultValue : "OK" }`

(Note: You may also supply a function that returns an array as the `options` property of the view class, similar to how you may supply a function that returns a hash for the built-in backbone `events` property.)

The `Backbone.ViewOptions.add()` method returns an array of the names of the options that were set on the view object, just in case you need 'em.

#### view.setOptions( optionHash )

Once `Backbone.ViewOptions.add()` has been called on a view, the `setOptions` method will be available on that view. This method may be used to change the value of any of the view's options after the view has been initialized. Only white-listed options in the view's `options` property may be set through `view.setOptions()`. It returns an array of the names of the options that were set on the view object.
