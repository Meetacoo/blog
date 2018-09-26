(function($){
	ClassicEditor
	.create( document.querySelector( '#editor' ),{
		language:'zh-cn',
		ckfinder:{
			uploadUrl:'/admin/uploadImages'
		}
		
	})
	.then( editor=>{
		window.editor = editor;
		// console.log(editor);
	})
	.catch( error =>{
		console.error( error );

	})

	$('#btn-sub').on('click',()=>{
		var articletitle = $('[name = "title"]').val();
		var articleintro = $('[name = "intro"]').val();
		var articlecontent = $('[name = "content"]').val();
		var articlecontent = editor.getData();
		var $err = $('.err');
		// alert(catename);
		if(articletitle.trim() == ''){
			$err.eq(0).html ('标题不能为空');
			return false;
		}else{
			$err.eq(0).html("");
		}

		if(articleintro.trim() == ''){
			$err.eq(1).html ('简介不能为空');
			return false;
		}else{
			$err.eq(1).html("");
		}
		/* */
		// console.log(articlecontent);

		if(articlecontent == '<p>&nbsp;</p>'){
			$err.eq(2).html ('内容不能为空');
			return false;
		}else{
			$err.eq(2).html();
		}
	})
})(jQuery)