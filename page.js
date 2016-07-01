var page = require('webpage').create();

var content = '<html><body><p>hello world</p></body></html>';
var url = 'http://qy-ci.mysoft.com.cn/workflow-micro/my56a9c966df069/workflow/process-detail/detail?kindType=5&processGuid=0e6c452a-4bfd-e511-80c5-00155d0a6f23&nodeGuid=4a27f15f-6508-e611-80c5-00155d0a6f23&bstype=%E5%85%B6%E4%BB%96%E5%AE%A1%E6%89%B9&siteKey=default&__from=wzs';
page.onLoadFinished = function(status) {
  console.log('status',status);
  page.render('./test.png');
  page.close();
  phantomjs.exit();
}
page.addCookie({
  'name' : 'PHPSESSID',
  'value': '67voa1ubtq6oiupqu2omk6e2q5',
  'domain'   : 'qy-ci.mysoft.com.cn',
  'path'     : '/',                /* required property */
  'httponly' : true,
  'secure'   : false,
  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)
});

page.open(url);
