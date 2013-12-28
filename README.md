# Backbone.ViewOptions

A mini [Backbone.js](http://backbonejs.org/) plugin to easily declare and set view options. Supports required options and default values.

## Benefits

* Use a simple declarative syntax to attach white-listed initialization options directly to your view objects. 
* Declare required options as such, so an exception is raised immediately if one is not supplied.
* Supply default values for particular options.
* Change options post-initialization via `view.setOptions()`.
* Can be used with any view class, including those in [Marionette](https://github.com/marionettejs/backbone.marionette), etc.

## Usage

```javascript
// Call Backbone.ViewOptions.add() and view.setOptions() in our base view constructor so
// that the view options functionality is added to all our views and options are attached.
BaseView = Backbone.View.extend( {
	initialize : function( options ) {
		Backbone.ViewOptions.add( this ); // initializes view options functionality on this view
		this.setOptions( options ); // set the view's options from initialization options
		...
	}
} );

ButtonView = BaseView.extend( {
	options : [ "label" ]

	initialize : function() {
		// Options that are white-listed in the view's "options" 
		// property are automatically attached to the view object.
		console.log( this.label );
	}
} );

// Outputs "OK" to the console.
myButtonView = new ButtonView( { "label" : "OK" } );

WidgetView = BaseView.extend( {
	options : [
		"type!", // Use a trailing explanation mark to indicate an option is required.
		{ name : "label", defaultValue : "OK" } // Use this syntax to give an option a default value.
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

## Methods and Properties

#### `Backbone.ViewOptions.add( view )`

Adds the view options functionality to a view object. Use it, along with `view.setOptions()`, in a view's `constructor` or `initialize` method:

```javascript
initialize : function( options ) {
	Backbone.ViewOptions.add( this );
	this.setOptions( options );
	...
}
```

Once this function has been called on a view, the `view.setOptions()` and `view.getOptionNames()` methods will be available.

#### `view.setOptions( optionHash, [ optionDeclarations ] )`

Sets the view's options from the values in `optionHash` as appropriate, given the option declarations in the `view.options` property (see below). If a "required" option is not supplied (and is not already a property of the view), an exception will be raised. The optional second argument may be used to supply alternative option declarations, instead of defaulting to those in `view.options`.

#### `view.getOptionNames( [ optionDeclarations ] )`

Returns an array containing the names of each of the options declared in `view.options` (or alternatively in `optionDeclarations`, if it is supplied).

#### `view.options` property

An "option declarations" array should be supplied as the `options` property of the view class. Each element in the array must be a string or an object.
* A string element simply white-lists the name of an option that should be attached to the view when it is supplied in `view.setOptions()`'s `optionsHash`. The name may optionally be followed by an explanation mark, which indicates a "required" option.
* An object element may be used to give an option a default value. Each object element should have two properties, `name` and `defaultValue`, e.g. `{ name : "label", defaultValue : "OK" }`

You may alternatively supply a function that _returns_ an array as `view.options`, very much like how you may supply a function that returns a hash for the built-in backbone `view.events` property.

#### `view._onOptionsChanged( changedOptions )` callback

This callback, if it exists, is invoked when option(s) _that are already present on the view object_ are changed via `view.setOptions()`. (Therefore is generally _not_ invoked when `view.setOptions` is called during view initialization.) `changedOptions` is a hash that maps the names of the options that were changed to their new values.
