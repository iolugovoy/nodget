app.on('init', () => {
	let $this = $('.top__slider');
	if ($this.length) {
		owlCarouselFacade($this.find('.slider__list'), {
			center: true,
			items: 1,
			start: 1
		}, ['xs', 'sm', 'md', 'lg', 'xl', 'ml'], $this.find('.owl-arrows__prev'), $this.find('.owl-arrows__next'));
	};


	// let $share = $('.top__share');
	// console.log($share);
	// if($share.length){
	// 	let linksWrapper = $share.find('.top__share-links');
	// 	let shareButton = $share.find('.top__share-button');
	// 	shareButton.on('focus hover', function(){
	// 		console.log('событие');
	// 		(function toggleShareLinks(linksWrapper) {
	// 			if (linksWrapper.data('expanded') == 'false') {
	// 				linksWrapper.animate({
	// 					width: 100%
	// 				});
	// 				linksWrapper.data('expanded') = 'true';
	// 			} else {
	// 				linksWrapper.animate({
	// 					width: 0
	// 				});
	// 				linksWrapper.data('expanded') = 'false';
	// 			}
	// 		})()
	// 	});

		
	// }


});	
