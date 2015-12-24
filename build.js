var glob = require('glob');
var fs = require('fs');
var path = require('path');

// Regex to extract version information from a DAT file.
var regexVersion = /version\s*#*>*[v?\d.?+\-?\s?+?x?\d*]+/
var regexName = /<?name>?(.+?)<?\/?n?a?m?e?>?$/m

glob('**/*.dat', function (err, files) {
  if (err) {
    throw new Error(err);
  }
  else {
    // Start from the external DATs.
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
        version = version.replace('version ', '').replace('version>', '').replace(/(\r\n|\n|\r)/gm, '').replace('\t', '')
        var author = path.dirname(files[i])
        var nameMatch = regexName.exec(contents);
        name = nameMatch[0].replace('<name>', '').replace('</name>', '').replace('"', '').replace('name ', '').replace('"', '')

        // Append the information to the output.
        dats.push({
          url: 'https://robloach.github.io/awesome-dats/' + files[i],
          name: name,
          description: name,
          version: version,
          author: author
        });
      }
    }

    // Sort the DATs.
    dats.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    // Build the XML.
    var output = '<clrmamepro>\n';
    for (var x in dats) {
      output = output + '  <datfile>\n' +
        '    <name>' + dats[x].name + '</name>\n' +
        '    <description>' + dats[x].description + '</description>\n' +
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
