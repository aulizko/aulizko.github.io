(function () {
    /**
     * Provides date utilites and extensions used by the library
     * @class Date
     * @static
     */
    Utilites.Date = Utilites.Date || {};
    var D = Utilites.Date;
    var months = ['января', 'февраля', 'марта', 'апреля', 'мая',  'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
        invalidMonth = "Такого месяца нетути",
        invalidDate = 'Неправильная дата';

    /**
     * Makes a date object from date string according to format
     * @method parseDate
     * @static
     * @param date Date as a string
     * @param format Date format
     * @return {Date} date
     */
    D.parseDate = function(date, format) {
        var result = new Date();
        result.setHours(0);
        result.setMinutes(0);
        result.setSeconds(0);
        switch (format) {
            // 2009-02-16 16:59:28.329
            case 'yyyy-mm-dd hh:ii:ss':
                var datetimeArray = date.split(' '), dateArray = datetimeArray[0].split('-'),
                        timeArray = datetimeArray[1].split(':');
                result.setDate(dateArray[2]);
                result.setMonth(parseInt(dateArray[1], 10) - 1);
                result.setFullYear(dateArray[0]);
                result.setHours(timeArray[0]);
                result.setMinutes(timeArray[1] ? timeArray[1] : 0);
                result.setSeconds(timeArray[2] ? timeArray[2] : 0);
                break;
            case 'yyyy-mm-dd':
                var dateArray = date.split('-');
                result.setDate(dateArray[2]);
                result.setMonth(parseInt(dateArray[1], 10) - 1);
                result.setFullYear(dateArray[0]);
                break;
            case 'd mmmm yyyy':
            case 'dd mmmm yyyy':
                var dateArray = date.split(' ');
                if (dateArray.length != 3) {
                    throw invalidDate;
                }
                result.setDate(dateArray[0]);
                var month = Array.indexOf(months, dateArray[1]);
                if (month == -1) {
                    throw invalidMonth;
                }
                result.setMonth(month);
                result.setFullYear(dateArray[2]);
                break;
            case 'dd.mm.yyyy':
                var dateArray = date.split('.');
                result.setDate(dateArray[0]);
                result.setMonth(parseInt(dateArray[1], 10) - 1);
                result.setFullYear(dateArray[2]);
                break;
        }
        return result;
    };

    /**
     * Formats date according to format
     * @method formatDate
     * @static
     * @param date Date object
     * @param format Date format
     * @return {String} formatted date
     */
    D.formatDate = function (date, format) {
        var year = date.getFullYear().toString(), month = (date.getMonth() + 1).toString(), day = date.getDate().toString(),
                hours = date.getHours().toString(), minutes = date.getMinutes().toString(), seconds = date.getSeconds().toString();
        switch (format) {
            // 2009-02-16 16:59:28.329
            case 'yyyy-mm-dd hh:ii:ss':
                return year
                        + '-' + (month.length < 2 ? '0' : '') + month
                        + '-' + (day.length < 2 ? '0' : '') + day
                        + ' ' + (hours.length < 2 ? '0' : '') + hours
                        + ':' + (minutes.length < 2 ? '0' : '') + minutes
                        + ':' + (seconds.length < 2 ? '0' : '') + seconds;
                break;
            case 'd mmmm yyyy':
                return day + ' ' + months[month - 1] + ' ' + year;
                break;
            case 'dd mmmm yyyy':
                return (day.length < 2 ? '0' : '') + day + ' ' + months[month - 1] + ' ' + year;
                break;
            case 'hh:ii':
                return (hours.length < 2 ? '0' : '') + hours
                        + ':' + (minutes.length < 2 ? '0' : '') + minutes;
                break;
            case 'dd.mm.yyyy':
                return (day.length < 2 ? '0' : '') + day
                        + '.' + (month.length < 2 ? '0' : '') + month
                        + '.' + year;
            case 'dd.mm.yy':
                return (day.length < 2 ? '0' : '') + day
                        + '.' + (month.length < 2 ? '0' : '') + month
                        + '.' + year.substr(2, 2);
        }
    };

    /**
     * Adds time to date
     * @method addTime
     * @static
     * @param date Date object
     * @param time Time string
     * @return {Date} date
     */
    D.addTime = function(date, time) {
        if (!time) {
            return date;
        }
        var timeArray = time.split(':');
        date.setHours(timeArray[0]);
        date.setMinutes(timeArray[1] ? timeArray[1] : 0);

        return date;
    };

    D.fromJson = function(date) {
        return D.parseDate(date, 'yyyy-mm-dd hh:ii:ss');
    };

    D.toJson = function(date) {
        return D.formatDate(date, 'yyyy-mm-dd hh:ii:ss');
    };
})();