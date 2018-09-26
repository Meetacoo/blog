(function($){
	$('#logout').on('click',()=>{
		$.ajax({
			url:'/user/logout',
			dataType:'json',
			type:'get'
		})
		.done((result)=>{
			if (result.code === 0) {
				// window.location.reload();
				window.location.href = '/';
			}
		})
		.fail((err)=>{
			console.log(err);
		})
	})
})(jQuery)