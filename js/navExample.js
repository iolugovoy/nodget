app.on('init', () => {
    let $this = $('.nav-example');
    if ($this.length) {
        let nav = new Nav('nav-example__item');
        nav.load(false).then(() => {
            $this.html(nav.getList());
            $this.on('click', '.nav-example__item_parent>.link', ev => {
                ev.preventDefault();
                let $item = $(ev.currentTarget).closest('.nav-example__item');
                let $submenu = $item.find('.nav-example__submenu');
                if ($submenu.length) {
                    $submenu.slideUp(() => {
                        $submenu.remove();
                    });
                } else {
                    let $sublist = $('<ul class="nav-example__submenu" style="padding-left:15px;display:none;"></ul>');
                    $sublist.html(nav.getList($item.data('id')));
                    $item.append($sublist);
                    $sublist.slideDown();
                }
            });
        });
    }
});