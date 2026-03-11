/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require("jsonwebtoken");
const token = jwt.sign(
  { userId: "123", email: "test@test.com", role: "driver" },
  "your-secret-key"
);
console.log(token);
const decoded = jwt.verify(token, "your-secret-key");
console.log(decoded);
