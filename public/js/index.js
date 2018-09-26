(function($){
	var $login = $('.login');
	var $register = $('.register');
	var $userInfo = $('.user-info');
	// console.log($register);
	$('#register').on('click',()=>{
		$login.hide();
		$register.show();
	})

	$('#login').on('click',()=>{
		$register.hide();
		$login.show();
	})

	/*$('#logout').on('click',()=>{
		$userInfo.hide();
		$login.show();
	})*/
 
	// 验证
	// 验证的正则
	var usernameReg = /^[a-z][a-z|0-9|_]{1,9}$/i;
	var passwordReg = /^\w{6,10}$/;
	// 用户注册
	$('.register-btn').on('click',()=>{
		var username = $('#register-username').val();
		var password = $('#register-password').val();
		var repassword = $('#repassword').val();
		var errmsg = '';
		// console.log(username);
		// 首字母，可有数字下划线，2-10个字符
		if (!usernameReg.test(username)) {
			errmsg = '首字母，可有数字下划线，2-10个字符';
			// console.log('首字母，可有数字下划线，2-10个字符');
		}
		// 密码6-10个字符
		else if (!passwordReg.test(password)) {
			errmsg = '6-10个字符';
			// console.log('6-10个字符');
		}
		else if (password != repassword) {
			errmsg = '密码不等';
			// console.log('密码不等');
		}
		else {
			// console.log('right');
		}

		if (errmsg) {
			$register.find('.err').html(errmsg);
			return;
		} else {
			$register.find('.err').html('');
			$.ajax({
				url:'/user/register',
				type:'POST',
				dataType:'json',
				data:{
					username:username,
					password:password
				}
			})
			.done((result)=>{
				if (result.code === 0) {
					$('#login').trigger('click');
				} else {
					$register.find('.err').html(result.message);
				}
			})
			.fail((err)=>{
				console.log(err);
			})
		}
	})

	// 用户登录
	$('.sub-btn').on('click',()=>{
		var username = $('#username').val();
		var password = $('#password').val();
		var errmsg = '';
		// console.log(username);
		// 首字母，可有数字下划线，2-10个字符
		if (!usernameReg.test(username)) {
			errmsg = '首字母，可有数字下划线，2-10个字符';
			// console.log('首字母，可有数字下划线，2-10个字符');
		}
		// 密码6-10个字符
		else if (!passwordReg.test(password)) {
			errmsg = '6-10个字符';
			// console.log('6-10个字符');
		}
		else {
			console.log('right');
		}

		if (errmsg) {
			$login.find('.err').html(errmsg);
			return;
		} else {
			$login.find('.err').html('');
			$.ajax({
				url:'/user/login',
				type:'POST',
				dataType:'json',
				data:{
					username:username,
					password:password
				}
			})
			.done((result)=>{
				// console.log(result)
				if (result.code === 0) {
					window.location.reload();
				} else {
					$login.find('.err').html(result.message);
				}
			})
			.fail((err)=>{
				console.log(err);
			})
		}
	})
	
	// 用户退出
	$('#logout').on('click',()=>{
		$.ajax({
			url:'/user/logout',
			dataType:'json',
			type:'get'
		})
		.done((result)=>{
			if (result.code === 0) {
				window.location.reload();
			}
		})
		.fail((err)=>{
			console.log(err);
		})
	})

/*	// 用户找回密码
	$('#resub-btn').on('click',()=>{
		$.ajax({
			url:'/user/repassword',
			dataType:'json',
			type:'get'
		})
		.done((result)=>{
			if (result.code === 0) {
				window.location.reload();
			}
		})
		.fail((err)=>{
			console.log(err);
		})
	})
*/

	//发送文章列表的请求
	var $articlePage = $('#article-page');
	$articlePage.on('get-data',function(err,result){
		// console.log(result);
		buildArticleList(result.data.docs);
		if (result.data.pages >1) {
			buildPage($articlePage,result.data.list,result.data.page)
		}
	})
	$articlePage.pagination();
	/*$('#page').on('click','a',function(){
		var $this = $(this);
		// console.log($this);
		var page = 1;
		var currentPage = $('#page').find('.active a').html();
		var label = $this.attr('aria-label');

		if(label == 'Previous'){//上一页
			page = currentPage - 1;
		}else if(label == 'Next'){//下一页
			page = currentPage*1 + 1;
		}else{
			page = $(this).html();
		}

		var query = 'page='+page;
		var category = $('#cate-id').val();

		if(category){
			query+="&category="+ category;
		}

		$.ajax({
			url:'/articles?'+query,
			type:'get',
			dataType:'json'
		})
		.done(function(result){
			if(result.code == 0){
				buildArticleList(result.data.docs);
				buildPage(result.data.list,result.data.page)
			}
			// console.log(result)
		})
		.fail(function(err){
			console.log(err)
		})
	})*/

	function buildArticleList(articles){
		// console.log('articles:::',articles)
		var html = '';
		for(var i = 0;i<articles.length;i++){
		var date = moment(articles[i].date).format('YYYY年MM月DD日 HH:mm:ss ');
		html +=`<div class="panel panel-default content-item">
					<div class="panel-heading">
						<h3 class="panel-title">
							<a href="/view/${articles[i]._id}" class="link" target="_blank">${ articles[i].title }</a>
						</h3>
					</div>
					<div class="panel-body">
						${ articles[i].intro }
					</div>
					<div class="panel-footer">
						<span class="glyphicon glyphicon-user"></span>
						<span class="panel-footer-text text-muted">
							${ articles[i].user.username }
						</span>
						<span class="glyphicon glyphicon-th-list"></span>
						<span class="panel-footer-text text-muted">
							${ articles[i].category.name }
						</span>
						<span class="glyphicon glyphicon-time"></span>
						<span class="panel-footer-text text-muted">
							${ date }
						</span>
						<span class="glyphicon glyphicon-eye-open"></span>
						<span class="panel-footer-text text-muted">
							<em>${ articles[i].click }</em>已阅读
						</span>
					</div>
				</div>`
		}
		$('#article-list').html(html);
	}


	function buildPage($page,list,page){
		var html = `<li>
						<a href="javascript:;" aria-label="Previous">
						<span aria-hidden="true">&laquo;</span>
						</a>
					</li>`

		for(i in list){
			if(list[i] == page){
				html += `<li class="active"><a href="javascript:;">${list[i]}</a></li>`;
			}else{
				html += `<li><a href="javascript:;">${list[i]}</a></li>`
			}
		}

		html += `<li>
					<a href="javascript:;" aria-label="Next">
					<span aria-hidden="true">&raquo;</span>
					</a>
				</li>`
		$page.find('.pagination').html(html)	    
	}

	// 发布评论
	var $commentPage = $('#comment-page');
	$('#comment-btn').on('click',function(){
		var articleId = $('#article-id').val();
		var commentContent = $('#comment-content').val();

		if (commentContent.trim() == '') {
			$('.err').html('评论内容不能为空');
			return false;
		} else {
			$('.err').html('');
		}

		$.ajax({
			url:'/comment/add',
			type:'POST',
			dataType:'json',
			data:{id:articleId,content:commentContent}
		})
		.done(function(result){
			console.log(result);
			if (result.code == 0) {
				// 1:渲染评论列表
				buildCommentList(result.data.docs);
				// 2:渲染分页
				buildPage($commentPage,result.data.list,result.data.page)
				$('#comment-content').val('');
			}
		})
		.fail(function(err){
			console.log(err);
		})
	})

	function buildCommentList(comments){
		// console.log('comments:::',comments)
		var html = '';
		for(var i = 0;i < comments.length;i++){
		var date = moment(comments[i].date).format('YYYY年MM月DD日 HH:mm:ss ');
		html +=`<div class="panel panel-default">
					<div class="panel-heading">
						${ comments[i].user.username } 发表于 ${ date }
					</div>
					<div class="panel-body">
						${ comments[i].content }
					</div>
				</div>`
		}
		$('#comment-list').html(html);
	}

	//发送文章列表的请求
	$commentPage.on('get-data',function(err,result){
		buildCommentList(result.data.docs);
		if (result.data.pages)  {
			buildPage($commentPage,result.data.list,result.data.page)
		}
	})
	$commentPage.pagination();
})(jQuery)