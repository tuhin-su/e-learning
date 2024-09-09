const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Read current environment.ts file and replace api_ip value with the one from .env
const envPath = './src/environments/environment.ts';
const fileContent = fs.readFileSync(envPath, 'utf8');
const updatedContent = fileContent.replace(
  /apiUrl: '.*'/,
  `apiUrl: '${process.env.API_IP}'`
);

// Overwrite environment.ts with the updated content
fs.writeFileSync(envPath, updatedContent);

module.exports = {};
