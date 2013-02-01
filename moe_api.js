// Generated by CozyScript 0.1.1
(function() {
  var MoeDB, app, cli, compile, db, express, find_in_dict, nib, options, stylus;

  express = require('express');

  stylus = require('stylus');

  nib = require('nib');

  cli = require('cli');

  MoeDB = require('./db.js').MoeDB;

  options = cli.parse({
    db_path: ['d', 'SQLite database path', 'string']
  });

  db = new MoeDB(options.db_path);

  app = express();

  compile = function(str, path) {
    return stylus(str).set('filename', path).use(nib());
  };

  app.set('views', __dirname + '/views');

  app.set('view engine', 'jade');

  app.set('view options', {
    layout: false
  });

  app.use(express.logger());

  app.use(express.bodyParser());

  app.use(express.cookieParser());

  app.use(express.session({
    secret: "moe"
  }));

  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
  }));

  app.use(express["static"](__dirname + '/public'));

  find_in_dict = function(query, cb) {
    var col, new_query;
    col = "title";
    if (/%$/.exec(query)) {
      col = "def";
      query = "%" + query;
      return db.find_all_by_def(query, cb);
    } else {
      if ((new_query = query.replace(/\$$/, '')) === query) {
        query += '%';
      } else {
        query = new_query;
      }
      return db.find_all_by_title(query, cb);
    }
  };

  app.get('/q/:query', function(req, res) {
    return find_in_dict(req.params.query, function(err, rows) {
      var defs, row, _i, _len;
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        defs = row.def.split(/\n/);
        row.def = defs;
        delete row.result;
      }
      return res.send(rows);
    });
  });

  app.listen(3000);

}).call(this);
