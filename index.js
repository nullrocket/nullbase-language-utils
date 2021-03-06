/* jshint node: true */
'use strict';
var path = require('path');
var jsonfile = require('jsonfile');
var XXH = require('xxhashjs').h32;
var fse = require('fs-extra');
var currentFingerprint = '';
var reload = require('require-reload')(require);
//var defaultLanguage = require('../assets/lang/src/default.js');
var selfx = null;
module.exports = {
  name: 'nullbase-language-utils',
 init: function(){
   this._super.init && this._super.init.apply(this, arguments);
selfx = this;
 },
  preBuild: function () {


    var languageDir = selfx.addonsFactory.project.config(process.env.EMBER_ENV).languageDir;
    var rootURL = selfx.addonsFactory.project.config(process.env.EMBER_ENV).rootURL;

    var defaultLanguage = reload(selfx.addonsFactory.project.root + '/app/language/default');

    var defaultLanguageString = JSON.stringify(defaultLanguage);


    var result = XXH(defaultLanguageString, 0xCAFEBABE).toString(16);

    var self = selfx;
    if ( result != currentFingerprint ) {
      try {
        console.log('Building Language files.')
        try {
          fse.removeSync(self.addonsFactory.project.root + '/public' + languageDir + '/default.*')
        }
        catch(e)
        {

        }
        currentFingerprint = result;
        jsonfile.writeFileSync(self.addonsFactory.project.root + '/public'+ languageDir + '/default.' + result + '.json', defaultLanguage);

        fse.writeFileSync(self.addonsFactory.project.root + '/app/lang-fingerprint.js', 'export default  {"default":"' + rootURL+ languageDir + '/default.' + result + '.json"};');

        console.log("Language files built.");

      }
      catch ( e ) {
        console.log(e)
      }
    }
    //fs.createReadStream('../assets/lang/default.json').pipe(fs.createWriteStream('../assets/newLog.log'));
  }

};
