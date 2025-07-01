const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const filePath = path.join(__dirname, '..', '..', 'resultados.csv');

function salvarResultadosCSV(resultados) {
  const csv = Papa.unparse(resultados);
  fs.writeFileSync(filePath, csv, 'utf8');
}

module.exports = salvarResultadosCSV;
