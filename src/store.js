const Proxy = window.Proxy || undefined;

if (!Proxy) {
  throw new Error('Proxy is not supported in this environment.');
}

const isObject = (value) => value && typeof value === 'object'
  && value.constructor === Object;

const reRender = () => {
  for (const key in componentCache) {
    componentCache[key]();
  }
}

export let componentCache = {};

export const store = new Proxy({}, {
  get: (target, name) => {
    if (name === 'state') {
      return target;
    }

    return target[name];
  },

  set: (target, name, value) => {
    if (name === 'state') {
      throw new Error(
        'The state property is protected. ' +
        'Use "store.update" to update multiple properties.'
      );
    }

    if (name === 'update') {
      if (isObject(value)) {
        target = Object.assign(target, value);
        reRender();
      } else {
        throw new Error('Update value must be an object literal');
      }

      return true;
    }

    // should always replace if primitives differ, or if objects or arrays
    // are being updated
    if (target[name] !== value) {
      target[name] = value;
      reRender();
    }

    return true;
  }
});
