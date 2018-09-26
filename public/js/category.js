(function($){
	$('#btn-sub').on('click',()=>{
		var categoryname = $('[name = "name"]').val();
		// alert(catename);
		if(categoryname.trim() == ''){
			$('.err').html ('分类名称不能为空');
			return false;
		}else{
			$('.err').html();
		}
	})
})(jQuery)