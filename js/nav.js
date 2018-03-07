function Nav(_itemClass) {
    let _config = {};
    let _topLevelIDList;

    function _prepare(source, level = 0, parent = null) {
        return source.map((el, i) => {
            _config[el.id] = $.extend({}, el);
            _config[el.id].level = level;
            if (parent) {
                _config[el.id].parents = [parent.id];
                if (parent.parents && $.isArray(parent.parents)) {
                    _config[el.id].parents = _config[el.id].parents.concat(parent.parents);
                }
            }
            if (el.children && $.isArray(el.children) && el.children.length) {
                _config[el.id]['children'] = _prepare(el.children, level+1, _config[el.id]);
            } else {
                delete _config[el.id]['children'];
            }
            return el.id;
        });
    }

    function _buildJQuery(el) {
        let $item = $(`<div class="${_itemClass} ${_itemClass}_${el.id}" data-id="${el.id}" data-level="${el.level}"></div>`);
        if (el.span) {
            $item.html(`<span class="link" onclick><span>${el.title}</span></span>`);
        } else {
            $item.html(`<a class="link" href="${el.link}"><span>${el.title}</span></a>`);
        }
        if (el.mod) {
            $item.addClass(_itemClass+'_'+el.mod);
        }
        if (el.active) {
            $item.addClass(_itemClass+'_active');
        }
        if (el.children) {
            $item.addClass(_itemClass+'_parent');
        }
        return $item;
    }

    this.getList = function(id) {
        let IDlist;
        if (id) {
            let parent = _config[id];
            IDlist = parent.children;
        } else {
            IDlist = _topLevelIDList;
        }
        if (!IDlist) return false;
        let $list = $([]);
        IDlist.forEach(idx => {
            $list = $list.add(_buildJQuery(_config[idx]));
        });
        return $list;
    };

    this.getParents = function(id) {
        if (!id) return [];
        let item = _config[id];
        let parents = [];
        if (item && item.parents) {
            parents = item.parents.slice(0);
        }
        parents.reverse();
        return parents;
    };

    this.hasChildren = function(id) {
        if (!id) return false;
        let item = _config[id];
        return item && item.children && item.children.length;
    };

    this.getCurrentParents = function() {
        let result = [];
        $.each(_config, (i, el) => {
            if (el.current) {
                result = this.getParents(el.id);
            }
        });
        return result;
    };

    this.load = function() {
        if (typeof _topLevelIDList !== 'undefined') {
            return new Promise(resolve => {
                resolve();
            })
        } else {
            return navLoader.load().then(_treeConfig => {
                _topLevelIDList = _prepare(_treeConfig);
            });
        }
    };

    this.debug = function() {
        console.log(_config);
    };
}

let navLoader = (function($) {
    let _config;
    return {
        load() {
            return new Promise(resolve => {
                if (typeof _config !== 'undefined') {
                    resolve(_config);
                } else {
                    loader.show();
                    let uri = new URI('/nav.php');
                    if (parseInt(window.currentPageID)) {
                        uri.setQuery('pageID', parseInt(window.currentPageID));
                    }
                    $.ajax(uri.toString(), {
                        dataType: 'json',
                        success(resp) {
                            _config = resp;
                            resolve(_config);
                        },
                        complete() {
                            loader.hide();
                        }
                    })
                }
            });
        }
    };
})(jQuery);