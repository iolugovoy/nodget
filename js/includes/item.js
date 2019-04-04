app.on('init', () => {
	$this = $('.item-page');

	if ($this.length) {
		owlCarouselFacade($this.find('.slider'), {
			center: true,
			items: 1,
			start: 1
		}, ['xs', 'sm', 'md', 'lg', 'xl', 'ml'], $this.find('.owl-arrows__prev'), $this.find('.owl-arrows__next'));
	}

	$descriptionLink = $('.description-link');
	$descriptionLink.click(function () {
		scrollTop($('.description').offset().top, true)
	});

	$specLink = $('.spec-link');
	$specLink.click(function () {
		scrollTop($('.specifications').offset().top, true)
	});

	$share = $('.share-btn');
	if ($share.length) {
		console.log($share);
		$share.click(function () {
			console.log('вухууу')
			$('.share-btn .share-block').css("display", "block")
		})

		app.on('scroll', () => {
			$('.share-btn .share-block').css("display", "none");
		})
	}
})