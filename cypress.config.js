const { defineConfig } = require("cypress");

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.google.com',
    chromeWebSecurity: false,
    supportFile: false,
    setupNodeEvents(on, config) {
      on("task", {
        salvarCSV(data) {
          const csv = Papa.unparse(data);
          const filePath = path.join(__dirname, "resultados.csv");
          fs.writeFileSync(filePath, csv, "utf8");
          return null;
        },
      });
    },
  }  
})

