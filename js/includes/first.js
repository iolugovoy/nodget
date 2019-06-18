app.on('init', () => {
	let $acsSlider = $('.top__slider');
	if ($acsSlider.length) {
		owlCarouselFacade($acsSlider.find('.slider__list'), {
			center: true,
			items: 1,
			start: 1
		}, ['xs', 'sm', 'md', 'lg', 'xl', 'ml'], $acsSlider.find('.owl-arrows__prev'), $acsSlider.find('.owl-arrows__next'));
	};
	let $this = $('.top__slider-wrapper');
	if ($this.length) {
		owlCarouselFacade($this.find('.top-slider'), {
			dots: true,
			responsive: {
				0: {
					items: 1
				},
				800: {
					items: 2
				}
			}
		}, ['xs', 'sm'], $this.find('.owl-arrows__prev'), $this.find('.owl-arrows__next'));
		
		$this.find('.slider__list').on('changed.owl.carousel', function(event) {
	    	$('.top__bg').removeClass('current');
	    	$('.top__bg').eq(event.item.index).addClass('current');
		})
	};

	let $share = $('.top__share');
	if($share.length){
		let linksWrapper = $share.find('.top__share-links');
		let shareButton = $share.find('.top__share-button');
		shareButton.click(function(){
			linksWrapper.toggleClass('shown');
		});		
		app.on('scroll', () => {
			linksWrapper.removeClass('shown');
		})
	}

	let $scrolbutton = $('.top__scroll');
	if($scrolbutton.length) {
		let ScreenHeight = window.innerHeight;

		$scrolbutton.click(function(){
			scrollTop(ScreenHeight, true);
		})
	}

});	
