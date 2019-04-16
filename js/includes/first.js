app.on('init', () => {
	let $this = $('.top__slider');
	if ($this.length) {
		owlCarouselFacade($this.find('.slider__list'), {
			center: true,
			items: 1,
			start: 1,
		}, ['xs', 'sm', 'md', 'lg', 'xl', 'ml'], $this.find('.owl-arrows__prev'), $this.find('.owl-arrows__next'));
		
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

	let $slidenums = $('.slide__num');
	console.log($slidenums, $slidenums.length);
	if($slidenums.length){
		let num = 0;
		for(let i = 0; i < $slidenums.length; i++){	
			num = i + 1;
			let text = '0' + num + '.';
			$slidenums.eq(i).text(text);
			console.log($slidenums.eq(i));
		}
	}
});	
