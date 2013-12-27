/*
 * Backbone.ViewOptions, v0.1
 * Copyright (c)2014 Rotunda Software, LLC.
 * Distributed under MIT license
 * http://github.com/rotundasoftware/backbone.viewOptions
*/

( function( Backbone ) {
	Backbone.ViewOptions = {};

	Backbone.ViewOptions.add = function( view, initializeOptions ) {

		view.setOptions = function( options, optionDeclarations ) {
			var _this = this;
			var namesOfOptionsThatWereSet = [];

			if( _.isUndefined( optionDeclarations ) ) optionDeclarations = _.result( _this, "options" );

			if( ! _.isUndefined( optionDeclarations ) ) {
				if( ! _.isArray( optionDeclarations ) ) throw new Error( "Option declarations must be an array." );

				_.each( optionDeclarations, function( thisOptionDeclaration ) {
					var thisOptionName, assertExists, thisOptionWasSet, thisOptionDefaultValue;

					assertExists = thisOptionWasSet = false;
					thisOptionDefaultValue = undefined;

					if( _.isString( thisOptionDeclaration ) )
						thisOptionName = thisOptionDeclaration;
					else if( _.isObject( thisOptionDeclaration ) ) {
						if( ! thisOptionDeclaration.name ) throw new Error( "Missing option name in option declaration object" );
						thisOptionName = thisOptionDeclaration.name;
						thisOptionDefaultValue = _.clone( thisOptionDeclaration.defaultValue );
					}
					else throw new Error( "Each element in the option declarations array must be either a string or an object." );

					if( thisOptionName[ thisOptionName.length - 1 ] === "!" ) {
						thisOptionName = thisOptionName.slice( 0, thisOptionName.length - 1 );
						
						// note we do not throw an error if a required option is not supplied, but it is found on the   
						// object itself (due to a prior call of view.setOptions, most likely)
						if( ! options || ! _.contains( _.keys( options ), thisOptionName ) &&
							_.isUndefined( _this[ thisOptionName ] ) )
							throw new Error( "Required option \"" + thisOptionName + "\" not supplied." );
					}

					// attach the supplied option, or the appropriate default value, to the view object
					if( options && thisOptionName in options ) {
						_this[ thisOptionName ] = options[ thisOptionName ];
						// we do NOT delete the option of the options object here, so that multiple view
						// can be passed the same options object without issue.
						thisOptionWasSet = true;
					}
					else if( ! _.isUndefined( thisOptionDefaultValue ) && _.isUndefined( _this[ thisOptionName ] ) ) {
						// note we do not write over any existing properties on the view itself.
						_this[ thisOptionName ] = thisOptionDefaultValue;
						thisOptionWasSet = true;
					}

					if( thisOptionWasSet ) namesOfOptionsThatWereSet.push( thisOptionName );
				} );
			}
			
			return namesOfOptionsThatWereSet;
		};
	};
} )( Backbone, _ );
