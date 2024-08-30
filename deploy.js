/**
* Set production config during deployment with GH Actions
*/
console.log('Starting deployment configuration file creation');

const fs = require('fs');
const path = require('path');

const dir = "src/environments";
const configDev = "environment.ts";
const configProd = "environment.prod.ts";

const content = `${process.env.APP_ENV}`;

fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    }
    catch (error) {
      process.exit(1);
    }
  }
  try {
    fs.writeFileSync(dir + "/" + configDev, content);
    fs.writeFileSync(dir + "/" + configProd, content);
    console.log("Config files created successfully in", process.cwd());
    if (fs.existsSync(dir + "/" + configDev)) {
      console.log("Dev config file is created", path.resolve(dir + "/" + configDev));
      console.log(fs.readFileSync(dir + "/" + configDev).toString());
    }
    if (fs.existsSync(dir + "/" + configProd)) {
      console.log("Prod config file is created", path.resolve(dir + "/" + configProd));
      console.log(fs.readFileSync(dir + "/" + configProd).toString());
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
