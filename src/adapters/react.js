import React from 'react';
import {componentCache, mapStoreCache} from '../store';

let componentId = 0;

export const attach = (AttachedComponent, mapFromStore = null) => {
  if (mapFromStore !== null && !Array.isArray(mapFromStore)) {
    throw new Error('mapStore passed to "attach" must be an array');
  }

  return class Attached extends React.Component {
    constructor (props, context) {
      super(props, context);

      this.id = componentId++;
      this.state = {};
    }

    componentDidMount () {
      componentCache[this.id] = this.reRender.bind(this);

      if (mapFromStore && mapFromStore.length > 0) {
        mapStoreCache[this.id] = mapFromStore;
      }
    }

    componentWillUnmount () {
      delete componentCache[this.id];
      delete mapStoreCache[this.id];
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
