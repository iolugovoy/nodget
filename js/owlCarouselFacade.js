function owlCarouselFacade($_this, _options, _scales, $_prev, $_next) {
    return new Promise(resolve => {
        let _enabled = false;
        if (!_scales) {
            _scales = ['xs','sm','md','lg','xl','ml'];
        }
        function _update() {
            if (isInScales(_scales)) {
                if (!_enabled) {
                    $_this.addClass('owl-carousel').owlCarousel($.extend({
                        nav: false,
                        dots: false,
                        onChanged(ev) {
                            app.lazyLoad.update();
                            if ($_prev && $_next) {
                                if (ev.item.index === 0) {
                                    $_prev.addClass('disabled');
                                } else {
                                    $_prev.removeClass('disabled');
                                }
                                if (ev.item.count - ev.item.index <= ev.page.size) {
                                    $_next.addClass('disabled');
                                } else {
                                    $_next.removeClass('disabled');
                                }
                                if ($_prev.is('.disabled') && $_next.is('.disabled')) {
                                    $_prev.hide();
                                    $_next.hide();
                                } else {
                                    $_prev.show();
                                    $_next.show();
                                }
                            }
                        },
                        onInitialized(ev) {
                            resolve($_this, ev);
                        }
                    }, _options));
                }
                _enabled = true;
            } else {
                if (_enabled) {
                    $_this.trigger('destroy.owl.carousel').removeClass('owl-carousel');
                }
                if ($_prev && $_next) {
                    $_prev.hide();
                    $_next.hide();
                }
                _enabled = false;
            }
        }
        if ($_prev && $_next) {
            $_prev.click(() => {
                if (_enabled) {
                    $_this.trigger('prev.owl.carousel');
                }
            });
            $_next.click(() => {
                if (_enabled) {
                    $_this.trigger('next.owl.carousel');
                }
            });
        }
        _update();
        app.on('changeScale', _update);
    });
}