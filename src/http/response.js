export default [
  res => {
    return res.data;
  },
  error => {
    return Promise.reject(error);
  }
];
