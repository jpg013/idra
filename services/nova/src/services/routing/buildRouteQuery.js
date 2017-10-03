const reducer = (acc, cur) => {
  switch(cur) {
    case 'containerName':
      acc.$set = {
        ...acc.$set || {},
        containerName,
      }
      break;
    default:
      break;
  }
};

const buildQuery = (queryProps={}) => Object.keys(queryProps).reduce(reducer, {});

module.exports = buildQuery;