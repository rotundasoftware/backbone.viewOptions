/*
 * Backbone.ViewOptions, v0.2
 * Copyright (c)2014 Rotunda Software, LLC.
 * Distributed under MIT license
 * http://github.com/rotundasoftware/backbone.viewOptions
*/

( function( Backbone ) {
	Backbone.ViewOptions = {};

	Backbone.ViewOptions.add = function( view, optionsChangedCallback ) {
		if( _.isUndefined( optionsChangedCallback ) ) optionsChangedCallback = "onOptionsChanged";

		// ****************** Public methods added to view ****************** 

		view.setOptions = function( options ) {
			var _this = this;
			var optionsThatWereChanged = {};
			var optionsThatWereChangedPreviousValues = {};

			var optionDeclarations = _.result( this, "options" );

			if( ! _.isUndefined( optionDeclarations ) ) {
				var normalizedOptionDeclarations = _normalizeOptionDeclarations( optionDeclarations );

				_.each( normalizedOptionDeclarations, function( thisOptionProperties, thisOptionName ) {
					thisOptionRequired = thisOptionProperties.required;
					thisOptionDefaultValue = thisOptionProperties.defaultValue;

					if( thisOptionRequired ) {
						// note we do not throw an error if a required option is not supplied, but it is  
						// found on the object itself (due to a prior call of view.setOptions, most likely)
						if( ! options ||
							( ( ! _.contains( _.keys( options ), thisOptionName ) && _.isUndefined( _this[ thisOptionName ] ) ) ) ||
							_.isUndefined( options[ thisOptionName ] ) )
							throw new Error( "Required option \"" + thisOptionName + "\" was not supplied." );
					}

					// attach the supplied value of this option, or the appropriate default value, to the view object
					if( options && thisOptionName in options ) {
						// if this option already exists on the view, make a note that we will be changing it
						if( ! _.isUndefined( _this[ thisOptionName ] ) ) {
							optionsThatWereChangedPreviousValues[ thisOptionName ] = _this[ thisOptionName ];
							optionsThatWereChanged[ thisOptionName ] = options[ thisOptionName ];
						}
						_this[ thisOptionName ] = options[ thisOptionName ];
						// note we do NOT delete the option off the options object here so that
						// multiple views can be passed the same options object without issue.
					}
					else if( ! _.isUndefined( thisOptionDefaultValue ) && _.isUndefined( _this[ thisOptionName ] ) ) {
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

		view.getOptions = function() {
			var optionDeclarations = _.result( this, "options" );
			if( _.isUndefined( optionDeclarations ) ) return [];
			
			var normalizedOptionDeclarations = _normalizeOptionDeclarations( optionDeclarations );
			var optionsNames = _.keys( normalizedOptionDeclarations );
			
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
				thisOptionDefaultValue = _.clone( thisOptionDeclaration[ thisOptionName ] );
			}
			else throw new Error( "Each element in the option declarations array must be either a string or an object." );

			if( thisOptionName[ thisOptionName.length - 1 ] === "!" ) {
				thisOptionRequired = true;
				thisOptionName = thisOptionName.slice( 0, thisOptionName.length - 1 );
			}

			normalizedOptionDeclarations[ thisOptionName ] = {
				required : thisOptionRequired,
				defaultValue : thisOptionDefaultValue
			};
		} );

		return normalizedOptionDeclarations;
	}
} )( Backbone, _ );