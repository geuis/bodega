import React from 'react';
import PropTypes from 'prop-types';
import {store} from 'bodega-store';

class TodoItem extends React.Component {
  constructor (props) {
    super(props);

    this.completeTodo = this.completeTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  completeTodo () {
    // returns a deep copy
    const todosList = store.todosList;

    todosList[this.props.index].completed = true;

    store.todosList = todosList;
  }

  deleteTodo () {
    const todosList = store.todosList;

    todosList.splice(this.props.index, 1);

    store.todosList = todosList;
  }

  render () {
    return (
      <div className="todo-item">
        <div className="text">{this.props.text} {Math.random()}</div>
        <div className="completed">
          {this.props.completed ? 'Done' : 'Not done'}
        </div>
        <button onClick={this.completeTodo} disabled={this.props.completed}>
          Complete
        </button>
        <button onClick={this.deleteTodo}>Delete</button>
      </div>
    );
  }
}

TodoItem.propTypes = {
  completed: PropTypes.bool,
  index: PropTypes.number,
  text: PropTypes.string,
};

export default TodoItem;
