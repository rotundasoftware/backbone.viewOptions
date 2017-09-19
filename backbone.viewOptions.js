/*
 * Backbone.ViewOptions, v0.2.4
 * Copyright (c)2014 Rotunda Software, LLC.
 * Distributed under MIT license
 * http://github.com/rotundasoftware/backbone.viewOptions
*/

( function( root, factory ) {
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define([ 'underscore', 'backbone' ], factory );
	} else if (typeof exports === 'object') {
		// Node
		module.exports = factory( require( 'underscore' ), require( 'backbone' ) );
	} else {
		// Browser globals
		root.returnExports = factory( root._, root.Backbone );
	}
} ( this, function( _, Backbone ) {
	Backbone.ViewOptions = {};

	Backbone.ViewOptions.add = function( view, optionsDeclarationsProperty ) {
		if( _.isUndefined( optionsDeclarationsProperty ) ) optionsDeclarationsProperty = "options";

		// ****************** Public methods added to view ******************

		view.setOptions = function( options ) {
			var _this = this;
			var optionsThatWereChanged = {};
			var optionsThatWereChangedPreviousValues = {};

			var optionDeclarations = _.result( this, optionsDeclarationsProperty );

			if( _.isString( options ) ) {
				options = {};
				options[ arguments[ 0 ] ] = arguments[ 1 ];
			}

			if( ! _.isUndefined( optionDeclarations ) ) {
				var normalizedOptionDeclarations = _normalizeOptionDeclarations( optionDeclarations );

				_.each( normalizedOptionDeclarations, function( thisOptionProperties, thisOptionName ) {
					var thisOptionRequired = thisOptionProperties.required;
					var thisOptionDefaultValue = thisOptionProperties.defaultValue;

					if( thisOptionRequired ) {
						// note we do not throw an error if a required option is not supplied, but it is
						// found on the object itself (due to a prior call of view.setOptions, most likely)

						if( ( ! options || ! _.contains( _.keys( options ), thisOptionName ) ) && _.isUndefined( _this[ thisOptionName ] ) )
							throw new Error( "Required option \"" + thisOptionName + "\" was not supplied." );

						if( options && _.contains( _.keys( options ), thisOptionName ) && _.isUndefined( options[ thisOptionName ] ) )
							throw new Error( "Required option \"" + thisOptionName + "\" can not be set to undefined." );
					}

					// attach the supplied value of this option, or the appropriate default value, to the view object
					if( options && thisOptionName in options && ! _.isUndefined( options[ thisOptionName ] ) ) {
						var oldValue = _this[ thisOptionName ];
						var newValue = options[ thisOptionName ];
						// if this option already exists on the view, and the new value is different,
						// make a note that we will be changing it
						if( ! _.isUndefined( oldValue ) && oldValue !== newValue ) {
							optionsThatWereChangedPreviousValues[ thisOptionName ] = oldValue;
							optionsThatWereChanged[ thisOptionName ] = newValue;
						}
						_this[ thisOptionName ] = newValue;
						// note we do NOT delete the option off the options object here so that
						// multiple views can be passed the same options object without issue.
					}
					else if( _.isUndefined( _this[ thisOptionName ] ) ) {
						// note defaults do not write over any existing properties on the view itself.
						_this[ thisOptionName ] = thisOptionDefaultValue;
					}
				} );
			}

			if( _.keys( optionsThatWereChanged ).length > 0 ) {
				if( _.isFunction( _this.onOptionsChanged ) )
					_this.onOptionsChanged( optionsThatWereChanged, optionsThatWereChangedPreviousValues );
				else if( _.isFunction( _this._onOptionsChanged ) )
					_this._onOptionsChanged( optionsThatWereChanged, optionsThatWereChangedPreviousValues );
			}
		};

		view.getOptions = function( whichOptions ) {
			var optionDeclarations = _.result( this, optionsDeclarationsProperty );
			if( _.isUndefined( optionDeclarations ) ) return {};

			var normalizedOptionDeclarations = _normalizeOptionDeclarations( optionDeclarations );
			var optionsNames = _.keys( normalizedOptionDeclarations );

			if( _.isUndefined( whichOptions ) ) whichOptions = optionsNames;
			else if( _.isString( whichOptions ) ) whichOptions = [ whichOptions ];
			
			return _.pick( this, optionsNames );
		};
	};

	// ****************** Private Utility Functions ******************

	function _normalizeOptionDeclarations( optionDeclarations ) {
		// convert our short-hand option syntax (with exclamation marks, etc.)
		// to a simple array of standard option declaration objects.

		var normalizedOptionDeclarations = {};

		if( ! _.isArray( optionDeclarations ) ) throw new Error( "Option declarations must be an array." );

		_.each( optionDeclarations, function( thisOptionDeclaration ) {
			var thisOptionName, thisOptionRequired, thisOptionDefaultValue;

			thisOptionRequired = false;
			thisOptionDefaultValue = undefined;

			if( _.isString( thisOptionDeclaration ) )
				thisOptionName = thisOptionDeclaration;
			else if( _.isObject( thisOptionDeclaration ) ) {
				thisOptionName = _.first( _.keys( thisOptionDeclaration ) );
				if( _.isFunction( thisOptionDeclaration[ thisOptionName ] ) )
					thisOptionDefaultValue = thisOptionDeclaration[ thisOptionName ];
				else
					thisOptionDefaultValue = _.clone( thisOptionDeclaration[ thisOptionName ] );
			}
			else throw new Error( "Each element in the option declarations array must be either a string or an object." );

			if( thisOptionName[ thisOptionName.length - 1 ] === "!" ) {
				thisOptionRequired = true;
				thisOptionName = thisOptionName.slice( 0, thisOptionName.length - 1 );
			}

			normalizedOptionDeclarations[ thisOptionName ] = normalizedOptionDeclarations[ thisOptionName ] || {};
			normalizedOptionDeclarations[ thisOptionName ].required = thisOptionRequired;
			if( ! _.isUndefined( thisOptionDefaultValue ) ) normalizedOptionDeclarations[ thisOptionName ].defaultValue = thisOptionDefaultValue;
		} );

		return normalizedOptionDeclarations;
	}

	return Backbone.ViewOptions;

} ) );
