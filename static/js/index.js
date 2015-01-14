/*jslint browser: true, unparam: true, indent: 2 */
/*global exports, ep_talk_to_watson, pad*/

exports.aceEditEvent = function (hook, context) {
  "use strict";
  if (!context.callstack.docTextChanged) {
    return;
  }
  
  console.log("--Eduardo--")
  // Original by simonwaldherr, http://shownotes.github.com/EtherpadBookmarklets/
  var ace = context.editorInfo.editor,
    padlines = ace.exportText().split('\n'),
    triggersq = ep_talk_to_watson.settings.triggerSequence,
    i = 0;

  for (i = 0; i < padlines.length; i += 1) {
    if (padlines[i].indexOf(triggersq + ' ') === 0) {
      var Localtime = new Date().toLocaleTimeString();
      var Timelength = Localtime.length;
      if (ep_talk_to_watson.settings.bold = true) {
        var now = "<strong>" + Localtime.substr(0, Timelength-3) + " Uhr</strong>";
      } else {
        var now = Localtime.substr(0, Timelength-3) + " Uhr";
      }
      ace.replaceRange([i, 0], [i, triggersq.length], now);
    }
  }
};


// vim:set sw=2 et:
