const makeUserSort = (sortField='', sortDir='asc') => {
  return {
    sortField: sortDir === 'asc' ? 1 : -1
  };
};

module.exports = makeUserSort;
