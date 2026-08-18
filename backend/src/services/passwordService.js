const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 */
const hashPassword = async (plainPassword) => {
  if (typeof plainPassword !== "string" || plainPassword.length === 0) {
    throw new Error("Password must be a non-empty string");
  }

  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare a plain-text password with a bcrypt hash.
 */
const comparePassword = async (plainPassword, passwordHash) => {
  if (
    typeof plainPassword !== "string" ||
    typeof passwordHash !== "string"
  ) {
    return false;
  }

  return bcrypt.compare(plainPassword, passwordHash);
};

module.exports = {
  hashPassword,
  comparePassword,
};