/*  Privacy, State, and Performance with JavaScript Closures    */




/*

Privacy with JavaScript Closures

Due to JS's functional scoping rules,
we can hide the bits we want to keep
private.

*/


// Create a module function with a private
// variable, and a private function.
// Return an object with a public method.
var module = (function() {
    var privateVar = 'close over me',
        privateFn = function() {
            console.log( privateVar );
        };
    
    return {
        publicFn: privateFn
    };
}());
// module.publicFn(); // => 'close over me'
// console.dir( module.publicFn );


// Pseudo inheritance
// with factory functions
// 
// Create a person type
// and a superhero sub-type
// that 'inherits' from the
// Person type

var person = function person( first, last ) {
    var getFirstName = function getFirstName() {
            return first;
        },
        getLastName = function getLastName() {
            return last;
        },
        getFullName = function getFullName() {
            return getFirstName() + ' ' + getLastName();
        };

    return {
        name: getFullName
    };
};

var superhero = function superhero( first, last, powers ) {
    var hero = person( first, last ),
        runPower;

    hero.powers = powers;

    runPower = function runPower( power ) {
        powers[power].call(hero);
    };

    return {
        run: runPower
    };
};

var superman = superhero( 'clark', 'kent', {
    flight: function flight() {
        console.log(this.name() + " is flying!");
    },
    laserVision: function laserVision() {
        console.log(this.name() + " is seeing through me!");
    }
});
// console.dir( superman.run );
// console.log( superman.run('laserVision') );




/*

Keeping State with JavaScript Closures

When a nested function closes over
a parent functions variable, it maintains
access to that variable, even after the
parent function has returned. This is not
access to a copy of that variable, it is
that actual variable in memory.

*/


// Maintain access to 'this'
// Create a flasher function
// that flashes an element
// when it is clicked.
var flasher = function( selector, ms ) {
    var element = document.querySelector( selector ),
        flash = function( event ) {
            var _this = this,
                hide = function() {
                    _this.style.display = 'none';
                },
                show = function( ) {
                    _this.style.display = 'block';
                };

            hide();
            window.setTimeout(show, ms);
        };

    element.addEventListener('click', flash);

    return element;
};
// flasher('.element1', 100);


// Create a bind function which 
// returns a new function that, 
// when called, is given a function
// and a sequence of arguments 
// preceding any provided when the 
// new function is called.
var bind = function( fn ) {
   var boundArgs = Array.prototype.slice.call( arguments, 1 );
 
   return function() {
      var args = boundArgs.concat( Array.prototype.slice.call( arguments ) );
 
      return fn.apply( null, args );
   };
};
// Create a memorize function
// that allows the ability
// to call the specified function
// passing the memory argument
// event after it no longer exists.
var memorize = function( memory, fn ) {
    fn( memory );
};

// var remember = bind( memorize, document.querySelector('.element1') );
// var remember = memorize.bind(null , document.querySelector('.element1') );
// console.dir( remember );

// remember(function( element ) {
//     console.log( element );
// });

// document.body.removeChild( document.querySelector('.element1') );

// remember(function( element ) {
//     document.body.appendChild( element );
// });

// remember(function( element ) {
//     console.log( element );
// });


// Create a listen function
// that attaches the specified
// event listener to the
// specified element, with the
// with the option to call
// the specified function
// on a child of the element
var listen = function( selector, eventName, fn, child /*optional*/ ) {
    var parent = document.querySelector( selector ),

        handler = function( event ) {
            var target;

            if ( child ) {
                target = parent.querySelector( child );
                if ( event.target === target )
                        fn.call( target, event);
            } else
                fn.call( parent, event );
        };

    // console.dir( handler );

    parent.addEventListener( eventName, handler );
 
    return parent;
};
// listen('.element1', 'click', function( event ) {
//     console.log('Yes, click anywhere');
// });
// listen('.element1', 'click', function( event ) {
//     console.log('See, child clicks only!');
// }, 'p');




/*

Performance with JavaScript Closures

When a nested function closes over
a parent functions variable, it maintains
access to that variable, even after the
parent function has returned. Thus, the
variable is not created each time the
nested function is called. 

*/


// Create a getMonth function with a
// nested function that closes over
// the months array.
var getMonth = (function() {

    var months = ['jan', 'feb', 'mar', 'apr',
                  'may', 'jun', 'jul', 'aug',
                  'sep', 'oct', 'nov', 'dec'];

    return function( ind ) {
        return months[ ind ];
    };
}());
// console.log( getMonth( 4 ) );
// console.dir( getMonth );
// http://jsperf.com/closure54


// Create a dom function that returns
// an element that has been cached
// or a newly queried element
var dom = (function() {
    var cached = {};

    return function( selector ) {
        var element;
        
        if ( cached[ selector ] ) {
            return cached[ selector ];
        } else {
            element = document.querySelector( selector );
            cached[selector] = element;
            return element;
        }
    };
}());
// console.log( dom( '.element1' ) );
// console.log( dom( '.element2' ) );
// console.log( dom( '.element1' ) );
// console.dir( dom );
// http://jsperf.com/cacheddom