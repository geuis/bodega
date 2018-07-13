# Bodega

Bodega is a single state store for modern browsers with no extra boilerplate.

The purpose of Bodega is to allow you to get all of the benefits of immutable data and unidirectional data flow in your apps while eliminating almost all boilerplate code that is encountered using other state libraries.

*Bodega is meant to be framework agnostic, but for the current early phase of development the focus and documentation generally centers on React applications. The store itself has no React dependencies, but the only current adapter is built for React.*

**Bodega is still in early, active development and shouldn't be used in production-ready apps just yet. You're encouraged (and it would be super helpful!) to try it out, file issues, and provide feedback on improvements to help get us to a stable first release.
**

## Installation
    npm install bodega-store --save

## Terminology
- store: The single store for the application. All state can be accessed from it.
- extend: A helper function for extending the store. Direct assignment through `store.state` works the same way. The value must be an object literal.
- attach: `attach` is an imported function for the adapter appropriate for the framework your application is built with. When you attach a component, you pass in an array of top-level property names as strings (`mapFromStore`) that will cause the component to re-render when those properties are updated. *Currently the only `attach` provided is for React.*

## How it works

Behind the scenes, Bodega uses a Proxy to manage the state for your application. 

- Accessing parts of the state always returns a mutable copy of the state tree. 
- Updates to the state are performed on the copy.
- The updated copy is then assigned back to the store and frozen internally. 
- A deep equality check is performed on the update, and if changes are detected all subscribed components are re-rendered.

A Todo demo application is included in the [/examples](https://github.com/geuis/bodega/tree/master/examples/todo "/examples") directory. Look at that to get a simple example of Bodega in action.

## API

### Importing the store

In any component that interacts with the store, import it:

    import {store} from 'bodega-store';

### Setting up your application store state

During application initialization, extend the store with your state via `extend`.

    import {extend} from 'bodega-store';
    
    const AppStore = () => {
      const state = {
        user: {
          name: null,
          loggedIn: false
        }
      };

      extend(state);
    };
    
    export default AppStore;

Alternatively, you can set the state directly:

    import {store} from 'bodega-store';

    store.state = {
      user: {
        name: null,
        loggedIn: false
      }
    }

Through either method, the underlying store is extended in the same way as `Object.assign({}, object1, object2)`. **Be aware that using the same top-level property name in a later state declaration will overwrite the earlier declared one.**

### Re-render components with `attach`
To get your component to re-render when the store changes, import the adapter for your application framework. In this example, we use the React adapter.

    import React from 'react';
    import {store, attach} from 'bodega-store';
    
    class User extends React.Component {
      constructor (props) {
        super(props);
      }
    
      render () {
        return (
          <div>
            <div>User Name: {store.user.name}</div>
            <div>Logged in: {`${store.user.loggedIn}`}</div>
          </div>
        )
      };
    
      const mapFromStore = [
        'user'
      ];
    
      export default attach(User, mapFromStore);

### attach and mapFromStore

The `attach` adapter registers your component to re-render when properties it subscribes to change. To subscribe to store properties, pass in an array of strings representing the top level level property names to watch. Be aware that its not currently possible to monitor deep properties, so directly changing "user.name" won't work for example.

### Retrieving, modifying, and updating the store

Working with the store is direct and simple. Any reference to a top level state property returns a mutable copy of that property. References to deep properties returns an immutable copy. 

    // returns a mutable copy of the user state
    const user = store.user;

Updates to the state are done on the copy.

    user.name = 'Bob Hope';
	user.loggedIn = true;
	
When the changes are complete, simply assign the updated copy back to the store property.

    store.user = user;
	
The final assignment then triggers Bodega to perform a deep freeze on the updated state and re-render any subscribed components for that state property.

### Async operations
There are no special requirements for performing async operations with Bodega.

For example, performing a remote fetch operation can happen anywhere in your application you want. All that you need to do when the operation is complete is to update the store with the new data.

See in the Todo example app where the [current time is updated] (https://github.com/geuis/bodega/blob/master/examples/todo/src/components/app.js).

### Things to watch out for

Retrieving a deep property returns an immutable copy of that value if its an object or array. Attempts to modify those will throw an error.

Top level state properties are not protected from overwrites. This means that you can accidentally overwrite an entire state property.

    let userName = store.user.name;
    userName = 'Bob Smith';
    store.user = userName;
	// store.user now returns 'Bob Smith' instead of the object originally representing the user state.
	
Setting a deep property on a state won't throw an error, but the change will have no effect and no re-render will occur.

    // no error is thrown
    store.user.name = null;
	store.user.loggedIn = false;
	
    console.log(store.user);
	// {
	//   user: {
	//     name: 'Bob Hope',
	// 	loggedIn: true
	//   }
	// }

## Questions, problems, suggestions, or comments?

File an issue on the [Issues page](https://github.com/geuis/bodega/issues "Issues page"). Bodega is a new project so problems and changes are expected. Your feedback is greatly appreciated!
