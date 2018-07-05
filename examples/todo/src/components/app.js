import React from 'react';
import {store, attach} from 'bodega-store';
import TodoList from 'components/todo-list';

class App extends React.Component {
  constructor (props) {
    super(props);

    // show off setting the time dynamically
    setInterval(() => {
      store.currentTime = (new Date()).toISOString();

      // this doesn't work
      // store.deepObject.test = Math.random();

      // but this does
      // store.deepObject = {
      //   test: Math.random()
      // }
    }, 1000);

    this.addTodo = this.addTodo.bind(this);
  }

  addTodo (ev) {
    ev.preventDefault();

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

// export default attach(App);
export default App;
