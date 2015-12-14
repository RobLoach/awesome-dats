var glob = require('glob');
var fs = require('fs');
var path = require('path');

var regexVersion = /version\s*#*>*[\d+\-*+?x?\d*]+/

glob('**/*.dat', function (err, files) {
  if (err) {
    throw new Error(err);
  }
  else {
    var dats = require('./externaldats');

    // Iterate through each file.
    for (var i in files) {
      if (files.hasOwnProperty(i)) {
        // Get the contents.
        var file = files[i];
        var contents = fs.readFileSync(file, 'utf8');

        // Find the DAT information.
        console.log('Processing: ' + files[i])
        var match = regexVersion.exec(contents);
        var version = match[0];
        version = version.replace('version', '').replace(' ', '').replace('>', '');
        var name = path.basename(files[i], '.dat');
        var author = path.dirname(files[i])
        console.log('    ' + author + ': ' + name + ' (' + version + ')')

        // Append the information to the output.
        dats.push({
          url: 'https://robloach.github.io/awesome-dats/' + files[i],
          name: name,
          version: version,
          author: author
        });
      }
    }

    // Sort the DAT files.
    dats.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    // Build the XML.
    var output = '<clrmamepro>\n';
    for (var x in dats) {
      output = output + '  <datfile>\n' +
        '    <name>' + dats[x].name + '</name>\n' +
        '    <description>' + dats[x].name + '</description>\n' +
        '    <version>' + dats[x].version + '</version>\n' +
        '    <author>' + dats[x].author + '</author>\n' +
        '    <url>' + dats[x].url + '</url>\n' +
        '  </datfile>\n';
    }
    output = output + '</clrmamepro>\n';

    // Save the file.
    fs.writeFileSync('dats.xml', output);
  }
})
