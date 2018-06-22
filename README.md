Bodega is a single state store for modern browsers with no extra boilerplate.

Behind the scenes, bodega uses a Proxy to manage the state for your application.

/* 
API:
  store.state: Return the current state of the store. Should be set protected. Throw error?
  store.update: Update the entire state with an object. Get protected. Set protected when value is not an object
*/

/* 
  Usage:
  Direct assignment: store.foo = 'bar', store.foo = {bar: true};
  Update/add multiple properties (useful during store setup) using Object.assign: 
    store.update({foo: 'bar', pirate: 'arrr'})
  Never operate directly on store arrays and objects. Make copies, modify, then assign
*/
