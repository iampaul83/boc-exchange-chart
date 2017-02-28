// Count all of the links from the io.js build page
var jsdom = require("jsdom");
var rp = require('request-promise');
var co = require('co');
var Q = require('q');
var jquery = require('fs').readFileSync(__dirname + "/node_modules/jquery/dist/jquery.min.js", "utf-8");

co(function* () {
    var feb = [];
    for (var i = 1; i <= 27; i++) {
        feb.push(`2017-02-${i}`);
    }

    var a = yield feb.map(date => getNtdForDate(date));

    console.log(JSON.stringify(a));
});

function getNtdForDate(date) {
    return co(function* () {
        var html = yield getBoc(date)
        var ntd = yield getNTD(html)
        return ntd;
    });
}

/**
 * 
 * 
 * @param {any} date - 2017-01-01
 * @returns 
 */
function getBoc(date) {
    return rp({
        method: 'POST',
        uri: 'http://srh.bankofchina.com/search/whpj/search.jsp',
        form: {
            erectDate: date,
            nothing: date,
            pjname: 2895
        }
    });
}

function getNTD(html) {
    return co(function* () {
        var $ = yield getJquery(html);
        var tr = $('div.BOC_main.publish tr:eq(1)');
        return {
            '现钞买入价': $('td:eq(2)', tr).html(),
            '现钞卖出价': $('td:eq(4)', tr).html(),
            '中行折算价': $('td:eq(6)', tr).html(),
            '发布时间': $('td:eq(7)', tr).html()
        };
    });
}

function getJquery(html) {
    var deferred = Q.defer();
    jsdom.env({
        html: html,
        src: [jquery],
        done: function (err, window) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(window.$);
            }
        }
    });
    return deferred.promise;
}