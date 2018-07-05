import {extend} from 'bodega-store';

const AppStore = () => {
  const state = {
    currentTime: (new Date()).toISOString(),
    todosList: [],
    deepObject: {
      test: {a: 123}
    }
  };

  extend(state);
};

export default AppStore;
