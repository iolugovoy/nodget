app.on('init', () => {
	let $this = $('.popular__slider');
	if ($this.length) {
		owlCarouselFacade($this.find('.slider__list'), {
			items: 1,
			start: 1,
			
			responsive: {
				800:{
					items: 2
				},
				1100: {
					stagePadding: 20,
					items: 3
				}
			}
		}, ['xs', 'sm', 'md', 'lg', 'xl', 'ml'], $this.find('.owl-arrows__prev'), $this.find('.owl-arrows__next'));
	};
})