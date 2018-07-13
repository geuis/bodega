import {extend} from 'bodega-store';

const AppStore = () => {
  const state = {
    currentTime: (new Date()).toISOString(),
    todosList: []
  };

  extend(state);
};

export default AppStore;
