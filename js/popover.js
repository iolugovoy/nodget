function Popover($this, $popover) {
    Events.call(this);
    let _this = this;
    let opened = false;
    let effect = $popover.data('effect') || 'fadeIn';
    $popover.hide();
    function open() {
        _this.emit('opening', $popover);
        $popover.addClass('no-touch');
        $popover.velocity(effect, {
            duration: 200,
            complete() {
                opened = true;
                $popover.removeClass('no-touch');
                _this.emit('open', $popover);
            }
        });
    }
    function close() {
        if (opened) {
            _this.emit('closing', $this);
            $popover.velocity('reverse', {
                duration: 200,
                complete() {
                    opened = false;
                    $popover.hide();
                    _this.emit('close', $this);
                }
            });
        }
    }
    $popover.find('[data-id="close"]').click(close);
    $this.clicktouch(() => {
        if (!opened) {
            open();
        }
    });
    $('html').clicktouch(ev => {
        if (opened && !$popover.filter(ev.target).length && !$popover.find(ev.target).length) {
            close();
        }
    });
    app.on('changeScale', close);
    this.close = close;
    this.open = open;
}

function initPopovers($body) {
    $body.find('[data-id="popover"]').each((i, el) => {
        let $popover = $(el);
        let id = $popover.data('name');
        let $el = $body.find(`[data-popover="${id}"]`);
        if ($popover.length && $el.length) {
            let popover = new Popover($el, $popover);
            $popover.data('popover-inst', popover);
            $el.data('popover-inst', popover);
        }
    });
}

app.on('init', () => {
    initPopovers($('body'));
    $('body').on('touchstart submit', '.no-touch', ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();
    });
});