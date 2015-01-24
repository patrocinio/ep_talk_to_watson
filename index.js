/*jslint browser: true*/
/*global exports*/
var settings;
var secretsettings = {};
var prompt = "@watson Ask me:";

var watsonAPI = require("./watsonapi.js");

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

exports.padUpdate = function(hook, _pad) {
  "use strict";
    var pad = _pad.pad;
    var padId = pad.id;
    
    console.log ("id: " + padId);
    
    var text = pad.atext.text;

	console.log ("text: " + JSON.stringify(text));

     var position = text.indexOf(prompt + ' ');
     var questionPosition = text.indexOf('?');
	console.log ("position: " + position +  " questionP " + questionPosition);
    if (position >= 0 &&  questionPosition > 0) {
    	var start = position + prompt.length;
       var question = text.substr(start, questionPosition - start + 1);
       var response = "You asked " + question;
       console.log ("response: " + response);
       	
       console.log( 'Calling Watson with question: ' + question );
       
       var before = text.substr(0, position);
       var after = text.substr(questionPosition+1, text.length - (questionPosition+1));
       console.log("before: " + before + " after: " + after);
       
       watsonAPI.askQuestion(question, pad, before, after);
    
  }
};

exports.clientVars = function(hook, context, callback) {
  "use strict";
  callback();
};
