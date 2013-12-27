# Backbone.ViewOptions

A mini [Backbone.js](http://backbonejs.org/) plugin to take care of your view options. Supports required options and default values.

## Benefits

* Use a simple declarative syntax to attach white-listed initialization options directly to your view objects. 
* Declare required options as such, so an exception is raised immediately if one is not supplied.
* Declare default values for particular options.
* White-listed options can be changed post-initialization via `view.setOptions()`.
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
		// Now the options white-listed in the view's "options" 
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

## Methods & Properties

#### `Backbone.ViewOptions.add( view )`

Adds the view options functionality to a view object. Use it, along with `view.setOptions`, in a view's (or your base view's) `constructor` or `initialize` method:

```javascript
initialize : function( options ) {
	Backbone.ViewOptions.add( this );
	this.setOptions( options );
	...
}
```

#### `view.setOptions( optionHash )`

Once `Backbone.ViewOptions.add()` has been called on a view, the `setOptions` method will be available on that view. This method may be used to set the value of the view's properties that are white-listed in the view's `options` property (see below). The method returns an array of the names of the options that were set on the view object (i.e the options white-listed in the `view.options` property), just in case you need 'em later.

#### `view.options` property

An "option declarations" array should be supplied as the `options` property of the view class (just like, for example, the built-in backbone `events` property). Each element in the array must be a string or an object.
* A string element simply white-lists the name of an option that should be attached to the view when it is supplied in `setOptions`'s `optionsHash`. The name may optionally be followed by an explanation mark, which indicates a "required" option. If such a "required" option is not supplied (and not already present as one of the view's properties), an exception will be raised.
* An object element may be used to give an option a default value. Each object element should have two properties, `name` and `defaultValue`, e.g. `{ name : "label", defaultValue : "OK" }`

You may alternatively supply a function that _returns_ an array as the `options` property of the view class, very much like how you may supply a function that returns a hash for the built-in backbone `events` property.
