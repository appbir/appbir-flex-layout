$(function() {
    var Fn = {},
        page, $panel;

    function getSelectItems() {
        var selectItem = $(".item-select");
        return selectItem.length ? selectItem : $(".flex-item");
    }

    function setCode(obj, isMain) {
        var propstr = JSON.stringify(obj, null, 2).replace(/"|,/g, '');
        if (isMain) {
            var items = getSelectItems();
            $(".flex-item-style").html(propstr);
            items.css(obj);
            return false;
        }
        $(".flex-container-style").html(propstr);
        $(".edit-panel").css(obj);
    }

    function publish(e) {
        var mainProp = {};
        var mainEle = $('.ele-ele');
        $.each(mainEle, function(index, ele) {
            var el = $(ele);
            var val = el.val();
            if (val) {
                mainProp[el.attr('name')] = val;
            }
        });
        setCode(mainProp);
    }

    function publishItem(e) {
        var itemProp = {};
        var itemEle = $('.item-ele-ele');
        $.each(itemEle, function(index, ele) {
            var el = $(ele);
            var val = el.val();
            if (val) {
                itemProp[el.attr('name')] = val;
            }
        });
        setCode(itemProp, true);
    }


    function createInput(option) {
        var opt = option || {};
        var $lable = $('<span>' + opt.label + '</span>');
        var $input = $('<input type="text" class="form-control ' + opt.tag + '"  name="' + opt.name + '"></input>');
        if (opt.disabled === false) $input.attr('disabled', true);
        $input.on('input', opt.publish);
        $input.val(opt.default)
        var $mainItem = $('<div class="main-item"/>');
        $mainItem.html([$lable, $('<form/>').html($input)]);
        return $mainItem;
    }


    function createSelect(option) {
        var opt = option || {};
        var $lable = $('<span>' + opt.label + '</span>');
        var opts = [];
        $.each(opt.data, function(index, data) {
            opts.push($('<option value="' + data + '">' + data + '</option>'));
        });
        var $select = $('<select class="form-control ' + opt.tag + '" name="' + opt.name + '"/>');
        $select.html(opts);
        $select.on('change', opt.publish);
        $select.val(opt.default);
        var $mainItem = $('<div class="main-item"/>');
        $mainItem.html([$lable, $("<form/>").html($select)]);

        return $mainItem;
    }



    function createEle() {
        var item = $('<div class="flex-item square"></div>').css({ background: '#' + (~~(Math.random() * (1 << 24))).toString(16) });
        item.on('click', function(e) {
            $(e.currentTarget).toggleClass('item-select');
            var styles = $(e.currentTarget).attr('style').split(';');
            var oStyle = {};
            $.each(styles, function(n, v) {
                var ins = v.split(":");
                oStyle[ins[0]] = ins[1];
            });
            delete oStyle.background;
            var propstr = JSON.stringify(oStyle, null, 2).replace(/"|,/g, '');
            $(".flex-item-style").html(propstr);
        });
        return item;
    }

    Fn.containerShow = function() {
        $(".flex-container-style").toggle(':visiable');
    }

    Fn.itemShow = function() {
        $(".flex-item-style").toggle(':visiable');
    }

    Fn.removeAll = function() {
        $panel.html("");
    }



    Fn.remove = function() {
        $('.edit-panel').children().last().remove();
    }

    Fn.append = function() {
        var ele = createEle();
        $panel.append(ele);
    }


    function initEvent() {
        $('span', $('.actions')).on('click', function(e) {
            var fn = $(e.target).attr('fn');
            fn && Fn[fn] && Fn[fn]();
        });
    }

    function createMain() {
        var maitag = "ele-ele";
        var mainProperty = [];
        // flex布局标识
        mainProperty.push(createSelect({ tag: maitag, label: 'display', default: 'flex', data: ['', 'inline-flex', 'flex'], name: 'display', publish: publish }));
        // 主属性
        mainProperty.push(createSelect({ tag: maitag, label: 'flex-direction', default: 'row', data: ['', 'row', 'row-reverse', 'column', 'column-reverse'], name: 'flex-direction', publish: publish }));
        mainProperty.push(createSelect({ tag: maitag, label: 'flex-wrap', default: 'nowrap', data: ['', 'nowrap', 'wrap', 'wrap-reverse'], name: 'flex-wrap', publish: publish }));
        mainProperty.push(createSelect({ tag: maitag, label: 'justify-content', default: 'flex-start', data: ['', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'], name: 'justify-content', publish: publish }));
        mainProperty.push(createSelect({ tag: maitag, label: 'align-content', default: 'stretch', data: ['', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'], name: 'align-content', publish: publish }));
        mainProperty.push(createSelect({ tag: maitag, label: 'align-items', default: 'stretch', data: ['', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'], name: 'align-items', publish: publish }));
        mainProperty.push(createInput({ tag: '', label: 'flex-flow', default: 'direction wrap', name: 'flex-flow', disabled: false, publish: publish }));
        return mainProperty;
    }

    function createItem() {
        var itemtag = 'item-ele-ele'
        var itemProp = [];
        itemProp.push(createInput({ tag: itemtag, label: 'order', name: 'order', default: 0, publish: publishItem }));
        itemProp.push(createInput({ tag: itemtag, label: 'flex-grow', name: 'flex-grow', default: 0, publish: publishItem }));
        itemProp.push(createInput({ tag: itemtag, label: 'flex-shrink', name: 'flex-shrink', default: 0, publish: publishItem }));
        itemProp.push(createInput({ tag: itemtag, label: 'flex-basis', name: 'flex-basis', default: 'auto', publish: publishItem }));
        itemProp.push(createSelect({ tag: itemtag, label: 'align-self', default: 'auto', data: ['', 'auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'], name: 'align-self', publish: publishItem }));
        itemProp.push(createInput({ tag: '', label: 'flex', name: 'flex', disabled: false, default: 'grow shrink basis', publish: publishItem }));
        return itemProp;
    }

    function createCombine() {
        var comtag = 'item-ele-ele';
        var comProp = [];
        comProp.push(createInput({ tag: comtag, label: 'margin-left', name: 'margin-left', default: '', publish: publishItem }));
        comProp.push(createInput({ tag: comtag, label: 'margin-right', name: 'margin-right', default: '', publish: publishItem }));
        comProp.push(createInput({ tag: comtag, label: 'height', name: 'height', default: '', publish: publishItem }));
        comProp.push(createInput({ tag: comtag, label: 'width', name: 'width', default: '', publish: publishItem }));
        return comProp;
    }

    function createProperty() {
        $('.exampleheader').html(createMain());
        $('.exampleItem').html(createItem());
        $('.examplecombine').html(createCombine());
    }


    function _init() {
        page = $('.examplecontainer');
        $panel = $('.edit-panel');
        createProperty();
        initEvent();
    }

    _init();
});