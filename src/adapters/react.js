import React from 'react';
import {componentCache} from '../store';

let componentId = 0;

export const attach = (AttachedComponent) => {
  return class Attached extends React.Component {
    constructor (props, context) {
      super(props, context);

      this.id = componentId++;
      this.state = {};
    }

    componentDidMount () {
      componentCache[this.id] = this.reRender.bind(this);
    }

    componentWillUnmount () {
      delete componentCache[this.id];
    }

    reRender () {
      this.setState({});
    }

    render () {
      return (
        <AttachedComponent {...this.props}></AttachedComponent>
      );
    }
  }
};
