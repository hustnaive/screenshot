var webserver = require('webserver').create();
var md5 = require('./md5');

var conf = require('./conf.json');
var root_path = conf.root_path;
var web_path = conf.web_path;

webserver.listen(8000,function(req,res) {
	if(req.method.toLowerCase() == 'post') {
		if(req.post) {
			var page = require('webpage').create();
			console.log("post",req.post);
			var imgtype = 'jpeg';
			var filename = md5(req.post)+'.'+imgtype;

			req.post = JSON.parse(req.post);

			var cb =  function (status) {
				console.log('status',status);
				page.evaluate(function(){
					document.body.bgColor = 'white';
				});

				page.viewportSize = req.post.viewport || {width:1276,height:800};
				page.scrollPosition = req.post.scroll || {top:0,left:0};

				page.render(root_path+filename, {format:imgtype});
				console.log(filename);
				res.write(JSON.stringify({errcode:0,url:web_path+filename}));
				res.close();
				page.close();
			};

			var url = req.post.url;
			var cookies = req.post.cookies instanceof Array ? req.post.cookies : [];
			var html = req.post.html;


			//设置cookie用于一些需要登录等的场景
			for(var i=0;i<cookies.length;i++) {
				cookies[i].path = cookies[i].path || '/';
				cookies[i].httponly = true;
				cookies[i].secure = cookies[i].secure || false;
				cookies[i].expires = cookies[i].expires || (new Date()).getTime() + (1000 * 60 * 60);
				page.addCookie(cookies[i]);
			}

			if(html && url) {
				console.log('设置内容');
				html = html.replace(/<script[^<]*?<\/script>/g,'');
				console.log(html);
				page.onLoadFinished = cb;
				page.setContent(html, url);
			}
			else if(url) {
				page.open(url, cb);
			}
			else {
				res.write(JSON.stringify({errcode:2,errmsg:'invalid request',req:req.post}));
			}
		}
		else {
			res.write(JSON.stringify({errcode:1,errmsg:'usage: post html-content',req:req}));
			res.close();
		}
	}
	else {
		res.statusCode = 400;
		res.send('bad request');
		res.close();
	}
});
