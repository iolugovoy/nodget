app.on('init', () => {
	let $this = $('.popular__slider');
	if ($this.length) {
		owlCarouselFacade($this.find('.slider__list'), {
			items: 3,
			start: 1,
			stagePadding: 20
		}, ['xs', 'sm', 'md', 'lg', 'xl', 'ml'], $this.find('.owl-arrows__prev'), $this.find('.owl-arrows__next'));
	};
})