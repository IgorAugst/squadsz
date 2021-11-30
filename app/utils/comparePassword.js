const bcrypt = require('bcrypt');

async function comparePassword(password, confirmPassword) {
  const isMatchPassword = await bcrypt.compare(password, confirmPassword);
  return isMatchPassword;
}

module.exports = comparePassword;
