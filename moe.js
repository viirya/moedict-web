// Generated by CozyScript 0.1.1
(function() {
  var cli, col, db, new_query, options, sqlite3;

  cli = require('cli');

  options = cli.parse({
    db_path: ['d', 'SQLite database path', 'string'],
    query: ['q', 'SQL query', 'string']
  });

  sqlite3 = require('sqlite3').verbose();

  db = new sqlite3.Database(options.db_path);

  col = "title";

  if (/%$/.exec(options.query)) {
    col = "def";
    options.query = "%" + options.query;
  } else {
    if ((new_query = options.query.replace(/\$$/, '')) === options.query) {
      options.query += '%';
    } else {
      options.query = new_query;
    }
  }

  db.serialize(function() {
    var sql;
    sql = "SELECT '' || title || '\t' || heteronyms.bopomofo || '\n» ' || group_concat(\n      def, '\n» '\n  ) || '\n' as result\n    FROM entries\n    JOIN heteronyms ON entry_id = entries.id\n    JOIN definitions ON heteronym_id = heteronyms.id\n   WHERE " + col + " LIKE '" + options.query + "'\nGROUP BY title, heteronyms.bopomofo;";
    return db.each(sql, function(err, row) {
      return console.log(row.result);
    });
  });

  db.close();

}).call(this);
