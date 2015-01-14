/*jslint browser: true*/
/*global exports*/
var settings;
var secretsettings = {};

exports.loadSettings = function (hook, context) {
  "use strict";
  var read = require('read');
  settings = {};
  settings.updateInterval = 30000;
  settings.triggerSequence = '@aw';

  if(context.settings.ep_talk_to_watson) {
    if(context.settings.ep_talk_to_watson.updateInterval) {
      settings.updateInterval = context.settings.ep_talk_to_watson.updateInterval;
    }
    if(context.settings.ep_talk_to_watson.triggerSequence) {
      settings.triggerSequence = context.settings.ep_talk_to_watson.triggerSequence;
    }
  }

};

exports.eejsBlock_scripts = function (hook, context) {
  "use strict";
  var syncJS = '<script type="text/javascript">\n';
  syncJS += 'var servDate = ' + new Date().getTime() + '\n';
  syncJS += 'var clientDate = new Date().getTime();\n';
  syncJS += 'ep_talk_to_watson = {}\n';
  syncJS += 'ep_talk_to_watson.timeDiff = servDate - clientDate;\n';
  syncJS += 'ep_talk_to_watson.settings = ' + JSON.stringify(settings) + ";\n";
  syncJS += '</script>\n';
  
  context.content = context.content + syncJS;
};

exports.handleMessage = function(hook, context, callback) {
  "use strict";
  var msg = context.message;
  var client = context.client;

  callback();
};

exports.clientVars = function(hook, context, callback) {
  "use strict";
  callback();
};
