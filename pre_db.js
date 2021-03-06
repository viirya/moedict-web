// Generated by CozyScript 0.1.1
(function() {
  var MoeDB, cli, db, options, punctuations, title_strs, to_clickable;

  cli = require('cli');

  MoeDB = require('./db.js').MoeDB;

  options = cli.parse({
    db_path: ['d', 'SQLite database path', 'string']
  });

  db = new MoeDB(options.db_path);

  title_strs = '';

  db.get_all_titles(function(err, rows) {
    var row, titles, _i, _len;
    titles = [];
    for (_i = 0, _len = rows.length; _i < _len; _i++) {
      row = rows[_i];
      titles.push(row.title);
    }
    title_strs = "\n" + titles.join("\n");
    return db.get_all_definitions(function(err, row) {
      row.def = to_clickable(row.def.replace("'", "''"), 0);
      return console.log("UPDATE definitions SET def = '" + row.def + "' WHERE id = " + row.id + ";");
    });
  });

  punctuations = ['，', '。', '（', '）', '「', '」'];

  to_clickable = function(def_str, loc) {
    var found_index, last_found_step, last_sub_def_str, step, sub_def_str;
    if (loc >= def_str.length) {
      return '';
    }
    step = 1;
    last_sub_def_str = '';
    last_found_step = 0;
    if (punctuations.indexOf(def_str.substr(loc, 1)) === -1) {
      while (loc + step <= def_str.length) {
        sub_def_str = def_str.substr(loc, step);
        if (punctuations.indexOf(sub_def_str.substr(sub_def_str.length - 1, 1)) === -1 && (found_index = title_strs.indexOf("\n" + sub_def_str) + 1) > 0) {
          if ((title_strs.indexOf("\n" + sub_def_str + "\n") + 1) > 0) {
            last_sub_def_str = sub_def_str;
            last_found_step = step;
          }
        } else {
          if (last_found_step >= 1) {
            return ("<a href=''#" + last_sub_def_str + "''>" + last_sub_def_str + "</a>") + to_clickable(def_str, loc + last_found_step);
          }
        }
        step++;
      }
    }
    return def_str.substr(loc, 1) + to_clickable(def_str, loc + 1);
  };

}).call(this);
