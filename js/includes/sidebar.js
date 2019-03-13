app.on('init', () => {
	
	let sidebarButton = $('#toggleSidebar');

	sidebarButton.click(function(){
		$('.sidebar').toggleClass('collapsed');
		$('.main').toggleClass('min-sidebar');
	});

	let $this = $('.sidebar'),
		timer,
		scrollTop;

	if (!Modernizr.touchevents) {

		$('body').on('mousewheel', (ev) => {
		   	scrollTop -= (ev.deltaFactor * ev.deltaY);
		   	clearTimeout(timer);
		   	timer = setTimeout(function() {
			   	$this.stop(true, false).animate({scrollTop: scrollTop}, 150, function() {
				   	scrollTop = $this.scrollTop();
			   	});
		   	}, 1);
	   	});
	}
});

