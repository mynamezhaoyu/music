export const addRedux = (val, type) => {
  return {
    type: type.toUpperCase(),
    data: val
  };
};