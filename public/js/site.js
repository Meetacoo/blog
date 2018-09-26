(function($){
	$('.btn-remove').on('click',function(){
		$(this.parentNode).remove();
	})
	$('.btn-add').on('click',function(){
		// console.log($(this));
		// var $this = $(this);
		// console.log($this.siblings().eq(0))
		var $dom = $(this).siblings().eq(0).clone(true);
		$(this.parentNode).append($dom);
		// $this.parent().append($dom);
		$dom.find('[type="text"]').val("");
	})
})(jQuery);