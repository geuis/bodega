import React from 'react';
import {store, attach} from 'bodega-store';
import TodoList from 'components/todo-list';

class App extends React.Component {
  constructor (props) {
    super(props);

    // show off setting the time dynamically
    setInterval(() => {
      store.currentTime = (new Date()).toISOString();

      // setting a new object to a store property updates the store 
      // and then freezes that object internally.
      // const obj = {bob: 'hope'};
      // store.deepObject = obj;
      // setting an object to the store freezes it
      // obj.bob = 123; // freeze error

      // accessing a store property always returns a mutable copy of the 
      // property. Modifying the copy does not update the store.
      // const obj = store.deepObject;
      // obj.test.b = 456;
      // console.log(obj.test); // {a: 123, b: 456}
      // console.log(store.deepObject.test); {a: 123}

      // directly modifying a deep object property has no effect.
      // the top level property returns a mutable copy, so changes are 
      // made to that copy. Only top level property assignment will 
      // update the store.
      // store.deepObject.test.b = 456;
      // console.log(store.deepObject); // {a: 123}

      // To change values and cause the store to update, make the changes
      // to a copy and set the top-level property with the new object or value
      // const obj = store.deepObject;
      // obj.test.b = 456;
      // console.log('before:', store.deepObject); {a: 123}
      // store.deepObject = obj; // {a: 123, b: 456}
      // console.log(store.deepObject);

      // equals test
      // const obj = store.deepObject;
      // // console.log(store.deepObject);
      // obj.test.a = 456;
      // store.deepObject = obj;
    }, 1000);

    this.addTodo = this.addTodo.bind(this);
  }

  addTodo (ev) {
    ev.preventDefault();

    if (ev.target.todotext.value === '') {
      return;
    }

    // always returns a copy
    const todosList = store.todosList;

    todosList.push({
      text: ev.target.todotext.value,
      completed: false
    });

    // clear input field
    ev.target.todotext.value = '';

    // assigning the updated data will update the store and trigger 
    // attached components to update. This should almost always be
    // the last step
    store.todosList = todosList;    
  }

  render () {
    const Timer = attach(() =>
      <div className="timer">Current time: {store.currentTime}</div>
      , ['currentTime']);

    return (
      <div className="container">
        <header>Bodega Todo Example App</header>

        <Timer></Timer>

        <div className="add-todo">
          <form onSubmit={this.addTodo}>
            <input type="text" placeholder="Todo text..." name="todotext" />
            <input type="submit" value="Add Item" />
          </form>
        </div>

        <TodoList></TodoList>
      </div>
    );
  }
}

export default App;
