/* 
 * Talk to Watson
 * 
 * 
 * */

exports.getFullHTMLForExport = function(hook, context) {
    /*var document = jsdom.jsdom('<p>' + context.html + '</p>');
    return [processNodes(document, {}, document).innerHTML];*/
   
   var html = context.html;
   return ['<p>' + html.replace(/<br><br>/g, '</p><p>') + '</p>'];
};

var testString = 'eric<br />eric<br /><br />eric';
var testString = 'eric eric<br />eric<br /><br />eric<br /><br />laatste paragraaf';

sys.puts(exports.getFullHTMLForExport('foo', {
    html : testString,
}), testString);

var cherieSaitFaireLesChoses = function(html) {
   return '<br>' + html.replace(/<br><br>/g, '</br>Hello Watson!<br>') + '</br>';
};