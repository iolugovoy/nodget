app.on('init', () => {
   function update($content) {
       $content.find('select').each((i, el) => {
           let $select = $(el);
           if (!$select.parent().is('.select')) {
               $select.wrap('<div class="select"></div>');
               $select.closest('.select').append('<div class="select__arrow"></div>');
           }
       });
   }
   update($('body'));
   modal.on('open', $modal => {
       update($modal);
   })
});