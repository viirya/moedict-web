// Generated by CozyScript 0.1.1
(function() {
  var app;

  app = angular.module('moedict-web', ['ngResource', '$strap.directives']);

  app.controller('MoeDictCtrl', function($scope, $resource) {
    var MoeDict, MoeTitleDict, keyinput, last_q, last_title_q;
    MoeDict = $resource('/q/web/:query$');
    MoeTitleDict = $resource('/q/title/:query');
    $scope.dict_items = [];
    $scope.dict_content = {};
    last_title_q = ' ';
    last_q = '';
    keyinput = false;
    window.updater = function(query) {
      auto_complete(query);
      return get_dict_content(query);
    };
    window.auto_complete = function(query) {
      var dict_items;
      if (query.length >= 1 && query.indexOf(last_title_q) !== 0) {
        last_title_q = query.substring(0, 1);
        return dict_items = MoeTitleDict.query({
          query: last_title_q
        }, function() {
          var item, _i, _len, _results;
          $scope.dict_items = [];
          _results = [];
          for (_i = 0, _len = dict_items.length; _i < _len; _i++) {
            item = dict_items[_i];
            _results.push($scope.dict_items.push(item.title));
          }
          return _results;
        });
      }
    };
    window.get_dict_content = function(query) {
      var dict_content;
      if (query === last_q) {
        return;
      }
      last_q = query;
      return dict_content = MoeDict.query({
        query: query
      }, function() {
        if ((dict_content != null) && (dict_content[0] != null) && (dict_content[0].title != null)) {
          $scope.dict_content.entries = dict_content;
          if (keyinput === true) {
            history.pushState(null, null, "#" + $scope.dict_q);
            keyinput = false;
          }
          return window.scrollTo(0, 0);
        }
      });
    };
    return $scope.change = function() {
      keyinput = true;
      return updater($scope.dict_q);
    };
  });

  $(document).ready(function() {
    var query_with_hash;
    query_with_hash = function() {
      var match;
      if (match = /^#(.*)/.exec(location.hash)) {
        window.get_dict_content(match[1]);
        return $('#query').scope().dict_q = match[1];
      }
    };
    window.onhashchange = query_with_hash;
    return query_with_hash();
  });

}).call(this);
