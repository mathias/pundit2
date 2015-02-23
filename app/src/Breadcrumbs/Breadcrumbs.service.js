angular.module('Pundit2.Breadcrumbs')
.service('Breadcrumbs', function(BaseComponent) {
    var breadcrumbs = new BaseComponent('Breadcrumbs');

    var state = {};

    var canChangeItemProperty = function(name, index) {
        if (index < 0) { return false; }
        if (typeof state[name] === 'undefined') { return false; }
        if (index >= state[name].items.length) { return false; }
        return true;
    };

    var setItemLabel = function(name, itemObject, label, index) {
        if (typeof label === 'undefined') {
            label = typeof itemObject.originalLabel !== 'undefined ' ? itemObject.originalLabel : itemObject.label;
        }
        var newLabel = label;
        // Set charLimit if needed and if it's set.
        var charLimit = (index + 1) >= state[name].items.length ? itemObject['charLimitAsLast'] : itemObject['charLimit'];
        if (typeof charLimit === 'number') {
            charLimit = charLimit < 4 ? 4 : charLimit;
            if (newLabel.length > charLimit) {
                newLabel = newLabel.substr(0, charLimit) + '...';
            }
        }
        itemObject.originalLabel = label;
        itemObject.label = newLabel;
    };

    var updateAllLabels = function(name) {
        for (var index in state[name].items) {
            setItemLabel(name, state[name].items[index], undefined, index);
        }
    }

    breadcrumbs.visible = function(name, value) {
        if (typeof state[name] !== 'undefined') {
            if (typeof value === 'boolean') {
                state[name].visible = value;
            }
            return state[name].visible;
        }
        return false;
    }

    breadcrumbs.add = function(name, conf) {
        var bcConf = {
            visible: true,
            firstItemPrefix: '',
            items: []
        };

        if (typeof conf !== 'undefined') {
            for (var i in conf) {
                bcConf[i] = conf[i];
            }
        }
        if (typeof state[name] === 'undefined') {
            state[name] = bcConf;
        }
    }

    breadcrumbs.remove = function (name) {
        if (typeof state[name] !== 'undefined') {
            delete state[name];
        }
    }

    breadcrumbs.itemSelect = function(name, index) {
        if (typeof state[name] !== 'undefined') {
            var item = state[name].items[index];
            if (typeof item !== 'undefined' &&
                item.hasOwnProperty('callback') &&
                typeof item.callback === 'function') {
                item.callback.call(null, index, item);
                breadcrumbs.dropItemsFromIndex(name, index + 1);
            }
        }
    }

    breadcrumbs.get = function(name) {
        if (typeof state[name] !== 'undefined') {
            return state[name];
        }
        return [];
    }

    breadcrumbs.getItems = function(name) {
        if (typeof state[name] !== 'undefined') {
            return state[name].items;
        }
        return [];
    }

    breadcrumbs.getItem = function(name, index) {
        index = index < 0 ? 0 : index;
        if (typeof state[name] !== 'undefined' && index < state[name].items.length) {
            return state[name].items[index];
        }
        return null;
    }

    breadcrumbs.appendItem = function(name, itemObject) {
        if (typeof state[name] !== 'undefined') {
            setItemLabel(name, itemObject, itemObject.label, state[name].items.length);
            state[name].items.push(itemObject);

            updateAllLabels(name);
        }
    }

    breadcrumbs.popItem = function(name) {
        if (typeof state[name] !== 'undefined') {
            state[name].items.pop();
            updateAllLabels(name);
        }
    }

    breadcrumbs.setItemLabel = function(name, index, label) {
        if (!canChangeItemProperty(name, index)) {
            return;
        }
        setItemLabel(name, state[name].items[index], label, index);
    }

    breadcrumbs.setItemCharLimit = function(name, index, charLimit) {
        if (!canChangeItemProperty(name, index)) {
            return;
        }
        state[name].items[index].charLimit = charLimit;
        setItemLabel(name, state[name].items[index], undefined, index);
    }

    breadcrumbs.setItemCharLimitAsLast = function(name, index, charLimit) {
        if (!canChangeItemProperty(name, index)) {
            return;
        }
        state[name].items[index].charLimitAsLast = charLimit;
        setItemLabel(name, state[name].items[index], undefined, index);
    }

    breadcrumbs.setFirstItemPrefix = function(name, label) {
        if (typeof state[name] === 'undefined') {
            return;
        }
        state[name].firstItemPrefix = label;
    }

    breadcrumbs.dropItemsFromIndex = function(name, index) {
        if (typeof state[name] !== 'undefined') {
            if (index >= state[name].items.length) {
                return;
            }
            index = index < 0 ? 0 : index;
            state[name].items.splice(index, state[name].items.length - index);
            updateAllLabels(name);
        }
    }

    return breadcrumbs;
});