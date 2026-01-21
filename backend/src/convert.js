const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = '"C:/advait/ipl-auction/backend/src/ipl2026_rated_players.csv"'; // Your CSV file path
const jsonFilePath = 'C:/advait/ipl-auction/backend/src/data.json'; // Output file path

csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    // Write the converted JSON to a file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2)); 
    console.log("Conversion complete! Check data.json");
  });