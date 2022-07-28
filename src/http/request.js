export default [
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
]
