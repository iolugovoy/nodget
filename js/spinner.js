function Spinner($_this) {
    Events.call(this);
    let $_input = $_this.find('input');
    let _val = parseInt($_input.val());
    let _max = parseInt($_this.data('max')) || 99;
    let _min = typeof $_this.data('min') !== 'undefined' ? parseInt($_this.data('min')) : _val;
    let _isFloat = false;
    let _step = 1;
    this.$el = $_this;
    let _this = this;
    function change(val, noFire = false) {
        val = _isFloat ? Math.round(parseFloat(val)*100)/100 : parseInt(val);
        if (val > _max) {
            val = _max;
        } else if (val < _min){
            val = _min;
        }
        $_input.val(val);
        if (_val !== val && !noFire) {
            _this.emit('change', val);
        }
        _val = val;
    }
    function increment() {
        change(_val+_step);
    }
    function decrement() {
        change(_val-_step);
    }
    $_this.off('click');
    $_this.on('click', '.spinner__button', ev => {
        if ($(ev.currentTarget).is('.spinner__button_plus')) {
            increment();
        } else {
            decrement();
        }
    });
    $_input.off('change');
    $_input.change(ev => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        if (_isFloat) {
            change($_input.val().replace(/,/, '.').replace(/[^\d\.]+/i, '') || 0);
        } else {
            change($_input.val().replace(/\D+/i, '') || 0);
        }
    });
    this.getValue = function() {
        return _val;
    };
    this.setValue = function(value) {
        change(value, true);
    };
    this.reset = function() {
        change(_min, true);
    };
    this.setIsFloat = function(isFloat) {
        _isFloat = !!isFloat;
        _step = _isFloat ? 0.1 : 1;
        if (!_isFloat) {
            change(Math.round(_val));
        }
    }
}

function initSpinners($body) {
    let result = [];
    $body.find('.spinner').each((i,el) => {
        let $this = $(el);
        if (!$this.data('spinner')) {
            let spinner = new Spinner($this);
            $this.data('spinner-inst', spinner);
            result.push(spinner);
        }
    });
    return result;
}