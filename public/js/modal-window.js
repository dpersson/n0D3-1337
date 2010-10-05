(function($){
	$.fn.modalWindow = function(options){
		var opts = $.extend({}, $.fn.modalWindow.defaults, options);
	    	var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
		$('.modal-window').fadeIn();
		$('.dim').fadeIn();
		$('.modal-window').draggable();

		$('.modal-close').click(function(){
			$(this).parent().fadeOut();
			$('.dim').fadeOut();
		});

		$(".dim").css("height", $(document).height());
		$('.modal-window').center();
	};
	
	$.fn.center = function(){
		this.css("position", "absolute");
    		this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    		this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    		return this;
	};

	$.fn.modalWindow.defaults = {
        	text: ''
	};
})(jQuery);
