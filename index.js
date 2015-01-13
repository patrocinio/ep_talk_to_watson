/* 
 * Talk to Watson
 * 
 * 
 * */

var findEnter = function(html) {
   return '<br>' + html.replace(/<br><br>/g, 'Hello Watson') + '<br>';
};
