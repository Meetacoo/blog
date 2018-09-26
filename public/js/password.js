(function($){
	// 验证
	// 验证的正则
	var passwordReg = /^\w{6,10}$/;
	$('#btnsub').on('click',()=>{
		var password = $('#password').val();
		var repassword = $('#repassword').val();
		var errmsg = '';
		var $err = $('.err');

		if(!passwordReg.test(password)){
			$err.eq(0).html ('6-10个字符');
			return false;
		}else{
			$err.eq(0).html("");
		}

		if(password != repassword){
			$err.eq(1).html ('密码不等');
			return false;
		}else{
			$err.eq(1).html("");
		}
	})
})(jQuery)