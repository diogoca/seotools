// Modules
const path = require('path');
const parse = require('csv-parse');
const fs = require('fs');
const url = require('url');
const request = require('sync-request');
const chalk = require('chalk');

fs.readFile(path.basename(process.argv[2]), 'utf8', function (err, outputFileData) {
  if (err) {
    return console.log(err);
  }

  function printOutput(index, statusCode, statusMessage, sourceUrlParsed, targetUrlParsed) {
    var output = "[" + index + "] " + chalk.inverse(statusCode) + " ";

    if (statusMessage == "SUCCESS") {
      output += chalk.green("SUCCESS");
    } else {
      output += chalk.red("FAILED");
    }

    output += " " + (url.parse(sourceUrlParsed)).pathname + chalk.yellow(' => ') + (url.parse(targetUrlParsed)).pathname;
    console.log(output);
  }

  parse(outputFileData, null, function(err, list) {

    for (var i = 0; i < list.length; i++) {

      var sourceUrlParsed = list[i][0];
      var targetUrlParsed = list[i][1];
      var expectedStatusCode = list[i][2];

      var response = request("GET", sourceUrlParsed);

      if(response.statusCode == expectedStatusCode) {
        printOutput(i, response.statusCode, "SUCCESS", sourceUrlParsed, targetUrlParsed);
      } else {
        printOutput(i, response.statusCode, "FAILED", sourceUrlParsed, targetUrlParsed);
      }

    }

  });

});
