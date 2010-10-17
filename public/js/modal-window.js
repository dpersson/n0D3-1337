(function($){
	$.fn.modalWindow = function(options){
		var opts = $.extend({}, $.fn.modalWindow.defaults, options);
	  var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
		$('#' + o.container).fadeIn();
		$('.dim').fadeIn();
		$('#' + o.container).draggable();

		$('.modal-close').click(function(){
			$(this).parent().fadeOut();
			$('.dim').fadeOut();
		});

		$('.dim').css("height", $(document).height());
		$('#' + o.container).center();
	};
	
	$.fn.center = function(){
		this.css("position", "absolute");
    		this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    		this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    		return this;
	};

	$.fn.modalWindow.defaults = {
    container: ''
	};
})(jQuery);
