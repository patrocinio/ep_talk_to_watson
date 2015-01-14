/*jslint browser: true, unparam: true, indent: 2 */
/*global exports, ep_talk_to_watson, pad*/

exports.aceEditEvent = function (hook, context) {
  "use strict";
  var prompt = "@watson Ask me:";
   
  if (!context.callstack.docTextChanged) {
    return;
  }
  
  // Original by simonwaldherr, http://shownotes.github.com/EtherpadBookmarklets/
  var ace = context.editorInfo.editor,
    padlines = ace.exportText().split('\n'),
    triggersq = ep_talk_to_watson.settings.triggerSequence,
    i = 0;

  for (i = 0; i < padlines.length; i += 1) { 
    if (padlines[i].indexOf(triggersq + ' ') === 0) {
      var now = prompt;
      ace.replaceRange([i, 0], [i, triggersq.length], now);
    }
    console.log("line: " + padlines[i] + " index: " + padlines[i].indexOf('?'));
    if (padlines[i].indexOf(prompt + ' ') == 0 && padlines[i].indexOf('?') > 0) {
       var question = padlines[i].substr(prompt.length, padlines[i].length-1);
       var response = "You asked " + question;
       console.log ("response: " + response);
       ace.replaceRange([i, prompt.length], [i, padlines[i].length], response);
    }
  }
};


// vim:set sw=2 et:
