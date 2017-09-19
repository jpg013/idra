const mapInstitutionsProps = fields => {
  if (!fields) {
    return;
  }  

  const {
    n: name,
  } = fields;

  return {
    name,
  };
};

module.exports = mapInstitutionsProps;