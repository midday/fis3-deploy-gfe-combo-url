'use strict';

/**
 * 对静态资源的url进行combo，请确保combo的资源包括在指定标签中
 * @param  {Object}   options  插件配置
 * @param  {Object}   modified 修改了的文件列表（对应watch功能）
 * @param  {Object}   total    所有文件列表
 * @param  {Function} next     调用下一个插件
 * @return {undefined}
 */
module.exports = function(options, modified, total, next) {
    //是否使用combo
    var useCombo = options.combo || true;
    //combo的url的分隔符
    var comboUrlDelimiter = options.comboUrlDelimiter || '??';
    //combo的查询分隔符
    var comboQueryDelimiter = options.comboQueryDelimiter || ',';
    //combo内容正则表达式
    var comboRegExp = /<!--\s*gfe:combo:begin\s*-->((?!<!--\s*gfe:combo:end\s*-->)[\s\S])*<!--\s*gfe:combo:end\s*-->/gi;
    //link标签正则表达式
    var linkTagRegExp = /<link[^>]*?href\s*=\s*('[^']*'|"[^"]*")[^>]*?\/?>/gi;
    //script标签正则表达式
    var scriptTagRegExp = /<script[^>]*?src=('[^']*'|"[^"]*")[^>]*?>\s*<\s*\/script\s*>/gi;
    //ssi标签正则表达式
    var ssiTagRegExp = /<!--[ ]*#[ ]*([a-z]+)([ ]+([a-z]+)=("|')(.+?)("|'))*[ ]*-->/gi;
    //domain正则表达式
    var domainRegExp = /^((https:\/\/|http:\/\/|\/\/)[a-zA-Z\.0-9]+(?=\/))|(__CSS_DOMAIN__)|(__JS_DOMAIN__)/gi;
    //combo的link标签
    var comboLinkTag = '<link rel="stylesheet" href="COMBO_URL">';
    //combo的script标签
    var comboScriptTag = '<script src="COMBO_URL"></script>';

    modified.forEach(function(file) {
        if (file.isText() || typeof(file.getContent()) === 'string') {
            var content = file.getContent();

            //包含html基本结构的入口文件
            var isEntryFile = (~content.indexOf('/html') || ~content.indexOf('/HTML')) && (~content.indexOf('/head') || ~content.indexOf('/HEAD')) && (~content.indexOf('/body') || ~content.indexOf('/BODY'));

            //html入口文件(非-debug调试文件)才combo
            if (useCombo && /\.(html|ftl)/.test(file.rExt) && !/-debug$/.test(file.filename) && isEntryFile) {
                content = content.replace(comboRegExp, function(comboContent) {
                    var comboTag = '';
                    var domain = '';
                    var pathArray = [];
                    var urlArray = [];

                    //link标签combo
                    if (linkTagRegExp.test(comboContent)) {
                        comboTag = comboLinkTag;
                        urlArray = comboContent.match(linkTagRegExp).map(function(value) {
                            //提取url并去除url首尾引号
                            return value.replace(linkTagRegExp, '$1').slice(1, -1);
                        });
                    }
                    //script标签combo
                    if (scriptTagRegExp.test(comboContent)) {
                        comboTag = comboScriptTag;
                        urlArray = comboContent.match(scriptTagRegExp).map(function(value) {
                            //提取url并去除url首尾引号
                            return value.replace(scriptTagRegExp, '$1').slice(1, -1);
                        });
                    }

                    urlArray.forEach(function(url, index) {
                        if (index === 0 && !ssiTagRegExp.test(url)) {
                            //以常量，http,https,//开头的域名
                            if (domainRegExp.test(url)) {
                                domain = url.match(domainRegExp)[0];
                            }
                        }

                        var path = url.replace(domainRegExp, '').replace(/^\//, '');
                        pathArray.push(path);
                    });

                    //如果domain为空，说明ssi为第一个，则不添加域名
                    var comboUrl = domain + (domain !== '' ? comboUrlDelimiter : '') + pathArray.join(comboQueryDelimiter);
                    comboTag = comboTag.replace('COMBO_URL', comboUrl);

                    return comboTag;
                });

                file.setContent(content);
            }
        }
    });
    next();
};
