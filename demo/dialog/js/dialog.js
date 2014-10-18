if (typeof DEMO == "undefined" || !DEMO) {
    var DEMO = {};
}

// Обратите внимание - объект строится по так называемому "модульному" паттерну, предложенному YAHOO!
// подробнее: http://ajaxian.com/archives/a-javascript-module-pattern
DEMO.Dialog = typeof DEMO.Dialog != 'undefined' && DEMO.Dialog ? DEMO.Dialog : function () {
    // "private"-свойства
    
    // создаем контейнер диалога и запоминаем его. 
    var dialog = document.createElement('div');
        
    dialog.className = 'dialog';
    dialog.style.display = 'none';
    document.body.appendChild(dialog);
    
    // Главная функция. На вход может приходить как строка (в этом случае она становится текстом окна)
    // так и объек со свойствами:
    // body {String} - текст окна
    // buttons {Array} - массив кнопок, при этом каждая кнопка - объект вида:
    //   id : {String} - id кнопки
    //   text : {String} - текст кнопки
    //   callback : {Function | Object} - либо функция (в этом случае она будет повешена на click по кнопке), либо объект вида:
    //     fn : {Function} непосредственно функция
    //     type : {String} тип события, на которое будет навешена функция.
    var render = function (o) {
        var html, i, length = (typeof o.buttons === 'undefined') ? 0 : o.buttons.length,
            button;
        
        // текст диалогового окна
        if (typeof o === 'string') {
            html = '<p>' + o + '</p>';
        } else {
            html = '<p>' + ((o.body) ? o.body : o) + '</p>';
        }
        
        for (i = 0; i < length; i++) {
            button = o.buttons[i];
            html += '<a href="#" id="' + button.id + '">' + button.text + '</a>';
        }
        
        // нам не нужно беспокоиться об утечках памяти, Дуглас Крокфорд побеспокоился за нас
        DEMO.DOM.setInnerHTML(dialog, html);
        dialog.style.display = 'block';
        
        activateListeners(o.buttons);
    };
    
    // навешиваем обработчики событий на кнопки. Если кнопок нет - ничего не делаем. 
    var activateListeners = function (buttons) {
        var i, length, button, isUndefined = DEMO.Lang.isUndefined;

        if (DEMO.Lang.isUndefined(buttons)) { return; }
        length = buttons.length;
        
        for (i = 0; i < length; i++) {
            button = buttons[i];
            if (!isUndefined(button.callback.type) && !isUndefined(button.callback.fn)) {
                DEMO.DOM.addListener(button.id, button.callback.type, button.callback.fn);
            } else {
                DEMO.DOM.addListener(button.id, 'click', button.callback);
            }
        }
        cached_buttons = buttons;
    };
    
    return {
        // публичный функции
        // показываем диалогове диалоговое окно
        show : function (o) {
            render(o);
        },
        // прячем диалоговое окно
        hide : function () {
            dialog.style.display = 'none';
        }
    };
}();