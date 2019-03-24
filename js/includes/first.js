app.on('init', () => {
	let $this = $('.top__slider');
	if ($this.length) {
		owlCarouselFacade($this.find('.slider__list'), {
			center: true,
			loop: true,
			items: 1,
			start: 1,
		}, ['xs', 'sm', 'md', 'lg', 'xl', 'ml'], $this.find('.owl-arrows__prev'), $this.find('.owl-arrows__next'));
	};
});	
