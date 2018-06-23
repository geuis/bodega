import React from 'react';
import {store, attach} from 'bodega-store';
import TodoItem from 'components/todo-item';

class App extends React.Component {
  constructor (props) {
    super(props);

    // show off setting the time dynamically
    setInterval(() => {
      store.currentTime = (new Date()).toISOString()
    }, 500);

    this.addTodo = this.addTodo.bind(this);
    // setInterval(() => {
    //   store.mapZoom = Math.floor(Math.random() * 10);

    //   store.update = {
    //     mapZoom: Math.floor(Math.random() * 10),
    //     bob: !store.bob
    //   };
    // }, 1000);

    // setTimeout(() => {
    //   const bobState = {...store.bob};
    //   delete bobState.was;
    //   console.log('#', bobState);
    //   store.bob = bobState;
    //   console.log('##', store.bob);
    // }, 2000);
  }

  addTodo (ev) {
    ev.preventDefault();

    // always work with copies of the data
    const todosList = [...store.todosList];

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
    return (
      <div className="container">
        <header>Bodega Todo Example App</header>
        <div className="timer">Current time: {store.currentTime}</div>

        <div className="add-todo">
          <form onSubmit={this.addTodo}>
            <input type="text" placeholder="Todo text..." name="todotext" />
            <input type="submit" value="Add Item" />
          </form>
        </div>

        <div className="todo-list">
          {store.todosList.map((item, i) =>
            <TodoItem
              completed={item.completed}
              index={i}
              key={Math.random()}
              text={item.text} >
            </TodoItem>
          )}
        </div>
      </div>
      // <Wrapper>
      //   <Zoom></Zoom>
      //   {/* <Pirate></Pirate> */}
      //   <Bob></Bob>

      //   <MapComponent mapZoom={store.mapZoom}></MapComponent>
      //   {/* <MapComponent></MapComponent> */}
      // </Wrapper>
    );
  }
}

export default attach(App);
