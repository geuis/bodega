import {store} from 'bodega-store';

const AppStore = () => {
  const state = {
    currentTime: (new Date()).toISOString(),
    todosList: []
  };

  store.update = state;
};

export default AppStore;
