let loader = (function($) {
    let $_this, _promise = new Promise(resolve => {resolve()}), _token = 0;
    return {
        init() {
            $_this = $('#loading');
            $_this = $('<div class="loading" id="loading"></div>');
            $('body').append($_this);
            this.hide();
        },
        showWhile(promise) {
            let i = ++_token;
            this.show();
            _promise = Promise.all([promise, _promise]).then(() => {
                this.hide(i);
            })
        },
        show: function() {
            $_this.show();
        },
        hide: function(token = _token) {
            if (token === _token) {
                $_this.hide();
            }
        },
    }
})(jQuery);

app.on('init', loader.init.bind(loader));