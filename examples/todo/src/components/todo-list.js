import React from 'react';
import {store, attach} from 'bodega-store';
import TodoItem from 'components/todo-item';

class TodoList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="todo-list">
        {store.todosList.map((item, i) =>
          <TodoItem
            completed={item.completed}
            index={i}
            key={`list-${i}`}
            text={item.text} >
          </TodoItem>
        )}
      </div>
    );
  }
}

// pass an array of references that cause the component to re-render
const mapFromStore = [
  'todosList',
  'deepObject'
];

export default attach(TodoList, mapFromStore);
