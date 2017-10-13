

const processConstituent = (item, cb) => {
  console.log('processing constituent, ', item.name);
  cb(undefined);
};

module.exports = processConstituent;
