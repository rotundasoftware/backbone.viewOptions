/*
 * Backbone.ViewOptions, v0.1
 * Copyright (c)2014 Rotunda Software, LLC.
 * Distributed under MIT license
 * http://github.com/rotundasoftware/backbone.viewOptions
*/

$( document ).ready( function() {
    
	// A base class for the typical behavior we want.
	TestView = Backbone.View.extend( {
		initialize : function( options ) {
			Backbone.ViewOptions.add( this );
			this.setOptions( options );
		}
	} );
    
	// Our first module concerns the creation of options in a viewOption
	module( "viewOptions creation", {} );
    
	// Basic creation with a single option called name.
	// We test by making an instance of a simple single option class
	// and check the option's value.
	// We also check that we get back the option name when calling
	// view.getOptionNames().
	test( "with a single option.",
		2,
		function() {
			var MyViewOptionsClass = TestView.extend( {
				options : [ "name" ]
			} );
	      
			viewOptionsInstance = new MyViewOptionsClass( { "name" : "helloWorld" } );
	      
			equal( viewOptionsInstance.name, "helloWorld", "Found the expected value for the single option." );
			// test getOptionNames on a single option.
			equal( viewOptionsInstance.getOptionNames(), "name", "Found the expected option name via view.getOptionNames()." );
	  	}
	);
    
	// Basic creation with multiple options.
	// We test that we can create an instance of an object with multiple
	// options and verify the option values.
	// We also check that we get back an array of names when calling
	// view.getOptionNames().
	test( "with multiple options.",
		4,
		function() {
			var MyViewOptionsClass = TestView.extend( {
				options : [ "required!", "optional", { "default" : "value" } ]
			} );

			// Test getOptionNames on multiple options.  We expect
			// results to strip any required marks as well as any
			// default values and return only the option names.
			viewOptionsInstance = new MyViewOptionsClass( { "required" : "ofCourse","optional" : "someTimes", "default"  : "always" } );
			equal( viewOptionsInstance.required, "ofCourse", "Required option correctly created with expected value." );
			equal( viewOptionsInstance.optional, "someTimes", "Optional option correctly created with expected value." );
			equal( viewOptionsInstance[ "default" ], "always", "Default option correctly created with expected value." );
			deepEqual( viewOptionsInstance.getOptionNames(), [ "required", "optional", "default" ],"Found the expected array of option names via view.getOptionNames()" );
		}
	);

	// Test the creation of a viewOption with a default value and without
	// a value provided to the constructor method.  We expect that the
	// default value will be used.
	test( "with the use of a default value.",
		2,
		function() {
			var MyViewOptionsClass = TestView.extend( {
				options : [ { "city" : "New York" } ]
			} );
			viewOptionsInstance = new MyViewOptionsClass();
			equal( viewOptionsInstance.city, "New York", "the expected default value was correctly used." );
			viewOptionsInstance = new MyViewOptionsClass( { "city" : "San Francisco" } );
			equal( viewOptionsInstance.city, "San Francisco", "the default value was correctly overridden when supplied to the constructor." );
	  	} 
	);


	// Test an aspect of default values, which concerns a view that already
	// has a value for an attribute, which a default value would normally 
	// set.  In that case we do not use the default value and leave the 
	// value stored inside the object alone.
	test( "with the use of a default value and a pre-existing value in the view.",
		1,
		function() {
			var MyViewOptionsClass = TestView.extend( {
				options : [ { "dinner" : "takeout" } ],
				dinner : "homecooked"
			} );
			viewOptionsInstance = new MyViewOptionsClass();
			equal( viewOptionsInstance.dinner, "homecooked", "the default value was correctly not used since the view contained a pre-existing value for the option." );
		}
	);

	// In reading the source I found that view.setOption() should not 
	// modify the options provided to the class definition.  Here we setup
	// a shared initialization options object and pass it to two instances
	// of MyViewOptionsClass1.  We test that the two instances will share
	// the same values.
	
	// We also setup a sharedOptions object and pass it to 
	// MyViewOptionsClass1 and  MyViewOptionsClass2.  We expect that both 
	// classes will have the same options.

	// This information does not appear in any documentation outside of 
	// source comments, but it stands that this behavior could be 
	/// depended on and therefore should be tested.

	test( "without modifying the value passed as the class options",
		7,
		function() {
			var sharedOptions = [ "make!", "model", { "size" : "default" } ];
			var sharedOptionsCopy = sharedOptions;
			var MyViewOptionsClass1 = TestView.extend( {
				options : sharedOptions
			} );
			var MyViewOptionsClass2 = TestView.extend( {
				options : sharedOptions
			} );

			// First test that initOptions are shareable.
			var initOptions = { "make" : "Ford", "model" : "A" };
			var viewOptionsInstance1 = new MyViewOptionsClass1( initOptions );
			var viewOptionsInstance2 = new MyViewOptionsClass1( initOptions );
			equal( viewOptionsInstance1.make, "Ford", "Found that instance 1 has the correct 'make' option." );
			equal( viewOptionsInstance2.make, "Ford", "Found that instance 2 has the correct 'make' option." );
			equal( viewOptionsInstance1.model, "A", "Found that instance 1 has the correct 'model' option." );
			equal( viewOptionsInstance2.model, "A", "Found that instance 2 has the correct 'model' option." );

			// Second test that Class1 and Class2 share options.
			viewOptionsInstance1 = new MyViewOptionsClass1( { "make" : "GM", "model" : "EV1" } );
	 		viewOptionsInstance2 = new MyViewOptionsClass2( { "make" : "Tesla", "model" : "Roadster" } );
			deepEqual( sharedOptions, sharedOptionsCopy,"view.options were not modified during instance construction." );
			deepEqual( sharedOptions, viewOptionsInstance1.options, "Instance1's options match the shared options." );
			deepEqual( sharedOptions, viewOptionsInstance2.options, "Instance2's options match the shared options." );

			// stash the two instances in viewOptionsInstance for
			// cleanup by the teardown method of the test module.
			viewOptionsInstance = [ viewOptionsInstance1,
						viewOptionsInstance2 ];
	  	} 
	);
    
	// The view.option can also be a function, which returns an array.
	// We test that we can create a class with a function for it's
	// options attribute and that we get back the expected option names
	// when calling view.getOptionNames() on an instance.
	test( "with the view.option as function.",
		2,
		function () {
			var MyViewOptionsClass = TestView.extend( {
				options : function() { 
					return [ "one!", "two", { "three" : "3" } ] 
				}
			} );

			viewOptionsInstance = new MyViewOptionsClass( { "one" : "1","two" : "2" } );
			equal( viewOptionsInstance.one, "1", "successfully created an instance of a viewOption class with options supplied by a function." );

			deepEqual( viewOptionsInstance.getOptionNames(), [ "one", "two", "three" ], "the expected option names were returned by view.getOptionNames()." );
							      
		} 
	);

	// Test creation of a viewOptions object without the provided required
	// option value.  In this case we expect that an exception be thrown.
	test( "with a required option not provided.",
		1,
		function() {
			var MyViewOptionsClass = TestView.extend( {
				options : [ "name!", "optional" ]	
			} );
	
			throws(
				function() {
					viewOptionsInstance = new MyViewOptionsClass( { "optional" : "yes" } );
				},
				"Correctly caught a required option missing exception."
			);
		} 
	);

	// Once a viewOption has been created, it's values can be modified, so
	// we need a new module to reflect tests that update viewOptions.
	module( "viewOptions value modification.", {} );
    
	// We can update options with a call to view.setOptions().  We test 
	// that this works.  We also test what happens when we set a required
	// field to undefined.
	test( "view.setOptions() alters option values.",
		3,
		function() {
			var MyViewOptionsClass = TestView.extend( {
				options : [ "name!" ]
			} );
	      
			viewOptionsInstance = new MyViewOptionsClass( { "name" : "Cassius Clay" } );
			equal( viewOptionsInstance.name, "Cassius Clay", "Initial required 'name' value set to expected value 'Cassius Clay'." );

			// Update the option value.
			viewOptionsInstance.setOptions( { "name" : "Muhammad Ali" } );
			// Test if it was updated correctly.
			equal( viewOptionsInstance.name, "Muhammad Ali", "The 'name' value successfully updated to new value 'Muhammad Ali'." );
	      
			// I assume we want never want an required field to be undefined.,
			// but maybe there are instances where a required option can be
			// undefined and that's ok...
			// I'm not too sure about this, so I'd like to get opinions.
			throws( 
				function() {
					viewOptionsInstance.setOptions( { "name" : undefined } )
				},
				"Correctly cought an Exception when setting the required value 'name' to undefined." );
		}
	);

	// When we modify a value in a viewOptions object it's possible to 
	// use onOptionsChanged to track changes that were made.
	asyncTest( "calls view.onOptionsChanged() method after view.setOptions()",
		2,
		function() {
			var MyViewOptionsClass = TestView.extend( {

				options : [ "year" ],
		       
				onOptionsChanged : function( changedOptions ) {
					equal( changedOptions[ "year" ], "2014", "Happy New Year, 2014!" );
				},
			} );

			viewOptionsInstance = new MyViewOptionsClass( { "year" : "2013" } );
			viewOptionsInstance.setOptions( { "year" : "2014" } );
		} 
	); 
} );
