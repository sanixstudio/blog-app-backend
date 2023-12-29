const AWS = require("aws-sdk");

AWS.config.update({
  secretAccessKey: import.meta.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: import.meta.env.AWS_ACCESS_KEY_ID,
  region: import.meta.env.AWS_REGION,
});

module.exports = AWS;
