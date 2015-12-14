var glob = require('glob');
var fs = require('fs');
var path = require('path');

var regexVersion = /version\s*#*>*[\d+\-*+?x?\d*]+/

function sortDat(a,b) {
  if (a.path < b.path)
    return -1;
  if (a.path > b.path)
    return 1;
  return 0;
}

glob('**/*.dat', function (err, files) {
  if (err) {
    throw new Error(err);
  }
  else {
    var dats = []

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
          path: files[i],
          name: name,
          version: version,
          author: author
        });
      }
    }

    var output = '<clrmamepro>\n';
    dats.sort(sortDat);
    for (var x in dats) {
      output = output + '  <datfile>\n' +
        '    <name>' + dats[x].name + '</name>\n' +
        '    <description>' + dats[x].name + '</description>\n' +
        '    <version>' + dats[x].version + '</version>\n' +
        '    <author>' + dats[x].author + '</author>\n' +
        '    <url>https://robloach.github.io/awesome-dats/' + dats[x].path + '</url>\n' +
        '  </datfile>\n';
    }
    output = output + '</clrmamepro>\n';
    fs.writeFileSync('dats.xml', output);
  }
})
