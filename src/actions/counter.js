export const addRedux = (val, type) => {
  return {
    type: type,
    data: val
  };
};