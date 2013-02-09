// Generated by CozyScript 0.1.1
(function() {
  var MoeDB, allowCrossDomain, app, cli, compile, db, eng_title_strs, express, find_in_dict, nib, options, query_dict, stylus, title_strs, util;

  express = require('express');

  stylus = require('stylus');

  nib = require('nib');

  util = require('util');

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

  allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return next();
  };

  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
  }));

  app.use(express["static"](__dirname + '/public'));

  app.use(function(error, req, res, next) {
    console.log(error);
    return res.send(500, {
      error: util.inspect(error)
    });
  });

  title_strs = [];

  eng_title_strs = {};

  db.get_all_titles(function(err, rows) {
    var new_title, row, title_item, title_len, titles, _i, _j, _len, _len1;
    titles = [];
    for (_i = 0, _len = rows.length; _i < _len; _i++) {
      row = rows[_i];
      new_title = row.title.replace(/\(.*\)/, '');
      if (row.title !== new_title) {
        eng_title_strs[new_title] = row.title;
        row.title = new_title;
      }
      if (titles[row.title.length] == null) {
        titles[row.title.length] = [];
      }
      titles[row.title.length].push(row.title);
    }
    for (title_len = _j = 0, _len1 = titles.length; _j < _len1; title_len = ++_j) {
      title_item = titles[title_len];
      if (title_item != null) {
        title_item = "\n" + title_item.join("\n");
      }
      title_strs[title_len] = title_item;
    }
    titles = [];
    return console.log("MoeDict server is ready");
  });

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

  query_dict = function(query, cb) {
    return find_in_dict(query, function(err, rows) {
      var definition, defs, examples, index, quote, quotes, row, types, _i, _j, _k, _len, _len1, _ref;
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        if (row.def != null) {
          defs = row.def.split(/\n/);
          row.def = defs;
        }
        if (row.example != null) {
          examples = row.example.split(/\n/);
          row.example = examples;
        }
        if (row.quote != null) {
          quotes = row.quote.split(/\n/);
          if (quotes != null) {
            row.quote = [];
            for (_j = 0, _len1 = quotes.length; _j < _len1; _j++) {
              quote = quotes[_j];
              row.quote.push(quote.split(','));
            }
          }
        }
        if (row.type != null) {
          types = row.type.split(/\n/);
          row.type = types;
        }
        row.definitions = [];
        for (index = _k = 0, _ref = row.def.length - 1; 0 <= _ref ? _k <= _ref : _k >= _ref; index = 0 <= _ref ? ++_k : --_k) {
          definition = {
            def: row.def != null ? row.def[index] : '',
            quote: row.quote != null ? row.quote[index] : '',
            example: row.example != null ? row.example[index] : '',
            type: row.type != null ? row.type[index] : ''
          };
          row.definitions.push(definition);
        }
        delete row.def;
        delete row.type;
        delete row.quote;
        delete row.example;
        delete row.result;
      }
      return cb(rows);
    });
  };

  app.get('/q/*', allowCrossDomain);

  app.get('/q/:query', function(req, res) {
    return query_dict(req.params.query, function(rows) {
      return res.send(rows);
    });
  });

  app.get('/q/web/:query', function(req, res) {
    var punctuations, to_clickable;
    punctuations = ['，', '。', '（', '）', '「', '」', '．', '：', '、'];
    to_clickable = function(def_str, loc) {
      var first_char, last_char, last_found_step, last_sub_def_str, step, sub_def_str;
      if (loc >= def_str.length) {
        return '';
      }
      step = 1;
      last_sub_def_str = '';
      last_found_step = 0;
      first_char = def_str.substr(loc, 1);
      if (punctuations.indexOf(first_char) === -1 && !/[\d|a-zA-Z]/.test(first_char)) {
        while (loc + step <= def_str.length) {
          sub_def_str = def_str.substr(loc, step);
          last_char = sub_def_str.substr(sub_def_str.length - 1, 1);
          if (punctuations.indexOf(last_char) === -1 && !/[\d|a-zA-Z]/.test(last_char)) {
            if ((title_strs[sub_def_str.length] != null) && (title_strs[sub_def_str.length].indexOf("\n" + sub_def_str + "\n") + 1) > 0) {
              last_sub_def_str = sub_def_str;
              last_found_step = step;
            }
          }
          step++;
        }
        if (last_found_step >= 1) {
          return ("<a href='#" + (eng_title_strs[last_sub_def_str] != null ? eng_title_strs[last_sub_def_str] : last_sub_def_str) + "'>" + last_sub_def_str + "</a>") + to_clickable(def_str, loc + last_found_step);
        }
      }
      return def_str.substr(loc, 1) + to_clickable(def_str, loc + 1);
    };
    return query_dict(req.params.query, function(rows) {
      var definition, index, row, _i, _j, _k, _len, _len1, _ref, _ref1;
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        _ref = row.definitions;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          definition = _ref[_j];
          if (definition.def != null) {
            definition.def = to_clickable(definition.def, 0);
          }
          if (definition.example != null) {
            definition.example = to_clickable(definition.example, 0);
          }
          if (definition.quote[0] !== '') {
            definition.isquote = true;
          } else {
            definition.isquote = false;
          }
          for (index = _k = 0, _ref1 = definition.quote.length - 1; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; index = 0 <= _ref1 ? ++_k : --_k) {
            if (definition.quote[index] != null) {
              definition.quote[index] = to_clickable(definition.quote[index], 0);
            }
            definition.quote[index] += "<script type=\"text/javascript\">$(\"a\").click(function(event) {\nreturn window.get_dict_content(event.target.text);\n});</script>";
          }
        }
      }
      return res.send(rows);
    });
  });

  app.get('/q/title/:query', function(req, res) {
    return db.find_all_titles_by_title(req.params.query, function(err, rows) {
      return res.send(rows);
    });
  });

  app.get('/', function(req, res) {
    return res.render('index');
  });

  app.listen(8080);

}).call(this);
