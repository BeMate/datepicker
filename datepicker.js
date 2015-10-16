/*!
 * DatePicker
 *
 * Copyright © 2015 Buti | BSD & MIT license | https://github.com/BeMate/datepicker
 */

(function(root, factory) {
  'use strict';

  if (typeof exports === 'object') {
    // CommonJS module
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function(req) {
      return factory();
    });
  } else {
    root.DatePicker = factory();
  }
}(this, function() {
  'use strict';

  /**
   * feature detection and helper functions
   */
  var hasEventListeners = !!window.addEventListener,
    document = window.document,
    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture) {
      if (hasEventListeners) {
        el.addEventListener(e, callback, !!capture);
      } else {
        el.attachEvent('on' + e, callback);
      }
    },

    removeEvent = function(el, e, callback, capture) {
      if (hasEventListeners) {
        el.removeEventListener(e, callback, !!capture);
      } else {
        el.detachEvent('on' + e, callback);
      }
    },

    fireEvent = function(el, eventName, data) {
      var ev;

      if (document.createEvent) {
        ev = document.createEvent('HTMLEvents');
        ev.initEvent(eventName, true, false);
        ev = extend(ev, data);
        el.dispatchEvent(ev);
      } else if (document.createEventObject) {
        ev = document.createEventObject();
        ev = extend(ev, data);
        el.fireEvent('on' + eventName, ev);
      }
    },

    trim = function(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },

    hasClass = function(el, cn) {
      return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn) {
      if (!hasClass(el, cn)) {
        el.className = (el.className === '') ? cn : el.className + ' ' + cn;
      }
    },

    removeClass = function(el, cn) {
      el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj) {
      return (/Array/).test(Object.prototype.toString.call(obj));
    },

    isDate = function(obj) {
      return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isWeekend = function(date) {
      var day = date.getDay();
      return day === 0 || day === 6;
    },

    isLeapYear = function(year) {
      // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function(year, month) {
      return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function(date) {
      if (isDate(date)) date.setHours(0, 0, 0, 0);
    },

    compareDates = function(a, b) {
      // weak date comparison (use setToStartOfDay(date) to ensure correct result)
      return a.getTime() === b.getTime();
    },

    extend = function(to, from, overwrite) {
      var prop, hasProp;
      for (prop in from) {
        hasProp = to[prop] !== undefined;
        if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
          if (isDate(from[prop])) {
            if (overwrite) {
              to[prop] = new Date(from[prop].getTime());
            }
          } else if (isArray(from[prop])) {
            if (overwrite) {
              to[prop] = from[prop].slice(0);
            }
          } else {
            to[prop] = extend({}, from[prop], overwrite);
          }
        } else if (overwrite || !hasProp) {
          to[prop] = from[prop];
        }
      }
      return to;
    },

    adjustCalendar = function(calendar) {
      if (calendar.month < 0) {
        calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
        calendar.month += 12;
      }
      if (calendar.month > 11) {
        calendar.year += Math.floor(Math.abs(calendar.month) / 12);
        calendar.month -= 12;
      }
      return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

      // bind the picker to a form field
      dataFields: [],

      // position of the datepicker, relative to the field (default to bottom & left)
      // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
      position: 'bottom left',

      bounded: false,

      // automatically fit in the viewport even if it means repositioning from the position option
      reposition: true,

      // the default output format for `.toString()` and `field` value
      format: 'dd/MM/yyyy',

      // the default data format `field` value
      dataFormat: 'yyyy/MM/dd',

      // option for a parser object
      // this object must to respond to:
      // - parser.format(date object, format string)
      // - parse.parse(date string, format string)
      parser: null,

      // first day of week (0: Sunday, 1: Monday etc)
      firstDay: 0,

      // the minimum/earliest date that can be selected
      minDate: null,
      // the maximum/latest date that can be selected
      maxDate: null,

      // number of years either side, or array of upper/lower range
      yearRange: 10,

      // used internally (don't config outside)
      minYear: 0,
      maxYear: 9999,
      minMonth: undefined,
      maxMonth: undefined,

      isRTL: false,

      // Additional text to append to the year in the calendar title
      yearSuffix: '',

      // Render the month after year in the calendar title
      showMonthAfterYear: false,

      // internationalization
      i18n: {
        previousMonth: 'Previous Month',
        nextMonth: 'Next Month',
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },

      // Theme Classname
      theme: null,

      // callback function
      onSelect: null,
      onOpen: null,
      onClose: null,
      onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function(opts, day, abbr) {
      day += opts.firstDay;
      while (day >= 7) {
        day -= 7;
      }
      return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function(d, m, y, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut) {
      if (isEmpty) {
        return '<td class="is-empty"></td>';
      }
      var arr = [];
      if (isDisabled) {
        arr.push('is-disabled');
      }
      if (isToday) {
        arr.push('is-today');
      }
      if (isSelected) {
        arr.push('is-selected');
      }
      if (isBetween) {
        arr.push('is-between');
      }
      if (isSelectedIn) {
        arr.push('is-selected-in');
      }
      if (isSelectedOut) {
        arr.push('is-selected-out');
      }
      return '<td data-day="' + d + '" class="' + arr.join(' ') + '">' +
        '<button class="pika-button pika-day" type="button" ' +
        'data-pika-year="' + y + '" data-pika-month="' + m + '" data-pika-day="' + d + '">' +
        d +
        '</button>' +
        '</td>';
    },

    renderWeek = function(d, m, y) {
      // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
      var onejan = new Date(y, 0, 1),
        weekNum = Math.ceil((((new Date(y, m, d) - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      return '<td class="pika-week">' + weekNum + '</td>';
    },

    renderRow = function(days, isRTL) {
      return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },

    renderBody = function(rows) {
      return '<tbody>' + rows.join('') + '</tbody>';
    },

    renderHead = function(opts) {
      var i, arr = [];
      for (i = 0; i < 7; i++) {
        arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
      }
      return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
    },

    renderTitle = function(instance, c, year, month, refYear) {
      var i, j, arr,
        opts = instance._o,
        isMinYear = year === opts.minYear,
        isMaxYear = year === opts.maxYear,
        html = '<div class="pika-title">',
        monthHtml,
        yearHtml,
        prev = true,
        next = true;

      for (arr = [], i = 0; i < 12; i++) {
        arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
          (i === month ? ' selected' : '') +
          ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled' : '') + '>' +
          opts.i18n.months[i] + '</option>');
      }
      monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month" tabindex="-1">' + arr.join('') + '</select></div>';

      if (isArray(opts.yearRange)) {
        i = opts.yearRange[0];
        j = opts.yearRange[1] + 1;
      } else {
        i = year - opts.yearRange;
        j = 1 + year + opts.yearRange;
      }

      for (arr = []; i < j && i <= opts.maxYear; i++) {
        if (i >= opts.minYear) {
          arr.push('<option value="' + i + '"' + (i === year ? ' selected' : '') + '>' + (i) + '</option>');
        }
      }
      yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + arr.join('') + '</select></div>';

      if (opts.showMonthAfterYear) {
        html += yearHtml + monthHtml;
      } else {
        html += monthHtml + yearHtml;
      }

      if (isMinYear && (month === 0 || opts.minMonth >= month)) {
        prev = false;
      }

      if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
        next = false;
      }

      if (c === 0) {
        html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
      }
      if (c === 0) {
        html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
      }

      return html += '</div>';
    },

    renderTable = function(opts, data) {
      return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
    },

    forEach = function(array, fn) {
      var i;

      for (i = 0; i < array.length; i++){
        fn(array[i], i);
      }
    },

    parents = function(node) {
      var nodes = [node];
      for (; node; node = node.parentNode) {
        nodes.unshift(node);
      }
      return nodes;
    },

    commonAncestor = function(node1, node2) {
      var parents1 = parents(node1);
      var parents2 = parents(node2);

      if (parents1[0] != parents2[0]) throw "No common ancestor!"

      for (var i = 0; i < parents1.length; i++) {
        if (parents1[i] != parents2[i]) return parents1[i - 1];
      }
    },

    /**
     * DatePicker constructor
     */
    DatePicker = function(options) {
      var self = this,
        opts = self.config(options);

      self._onMouseDown = function(e) {

        if (!self._v) {
          return;
        }
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (!target) {
          return;
        }

        if (!hasClass(target.parentNode, 'is-disabled')) {
          if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty')) {
            self.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));

            // If there is no end date yet, we don't close on click the calendar
            if (self._e != null || !opts.multiple) {
              sto(function() {
                self.hide();

                forEach(opts.fields, function(field){
                  field.blur();
                })
              }, 100);
            }

            return;
          } else if (hasClass(target, 'pika-prev')) {
            self.prevMonth();
          } else if (hasClass(target, 'pika-next')) {
            self.nextMonth();
          }
        }
        if (!hasClass(target, 'pika-select')) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
            return false;
          }
        } else {
          self._c = true;
        }
      };

      self._onChange = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (!target) {
          return;
        }
        if (hasClass(target, 'pika-select-month')) {
          self.gotoMonth(target.value);
        } else if (hasClass(target, 'pika-select-year')) {
          self.gotoYear(target.value);
        }
      };

      self._onInputChange = function(e) {
        var date, field;
        field = e.target;

        if (e.firedBy === self) {
          return;
        }

        if (this.hasParser) {
          date = this._p.parse(field.value, opts.format);
        } else {
          date = new Date(Date.parse(field.value));
        }

        if (isDate(date)) {
          self.setDate(date)
        }
        if (!self._v) {
          self.show(field);
        }
      };

      self._onInputFocus = function(e) {

        var field = e.target;

        if (self._f != null) {
          if (self._f !== field) {
            self._v = false;
          }
        }

        self._f = field;
        self.show(field);
      };

      self._onInputClick = function(e) {
        var field = e.target;
        self.show(field);
      };

      self._onClick = function(e) {

        e = e || window.event;
        var target = e.target || e.srcElement,
          pEl = target;
        if (!target) {
          return;
        }
        if (!hasEventListeners && hasClass(target, 'pika-select')) {
          if (!target.onchange) {
            target.setAttribute('onchange', 'return;');
            addEvent(target, 'change', self._onChange);
          }
        }
        do {
          if (hasClass(pEl, 'pika-single') || opts.fields.indexOf(pEl) !== -1) {
            return;
          }
        }
        while ((pEl = pEl.parentNode));
        if (self._v && opts.fields.indexOf(target) === -1 && opts.fields.indexOf(pEl) === -1) {
          self.hide();
        }
      };

      self.el = document.createElement('div');
      self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '') + (opts.multiple ? ' is-multiple' : ' is-single');

      addEvent(self.el, 'mousedown', self._onMouseDown, true);
      addEvent(self.el, 'touchstart', self._onMouseDown, true);
      addEvent(self.el, 'change', self._onChange);

      if (opts.bounded === true) {
        var common;
        if (opts.fields.length === 2) {
          common = commonAncestor(opts.fields[0], opts.fields[1]);
        } else {
          common = opts.fields[0].parentNode;
        }
        common.appendChild(self.el);
      } else {
        document.body.appendChild(self.el);
      }

      self.hasParser = (opts.parser != null);

      forEach(opts.fields, function(field, index){
        var tmp;

        addEvent(field, 'change', self._onInputChange);
        addEvent(field, 'click', self._onInputClick);
        addEvent(field, 'focus', self._onInputFocus);

        if (self.hasParser && field.value) {
          tmp = self._p.parse(field.value, opts.format);
        } else {
          tmp = new Date(Date.parse(field.value));
        }

        if (isDate(tmp)) {
          setToStartOfDay(tmp);
          if (index > 0) {
            self._e = tmp;
          } else {
            self._s = tmp;
          }
          self._f = field;
          self.gotoDate(tmp);
        } else {
          self.gotoDate(new Date());
        }
      });

      this.hide();
    };


  /**
   * public DatePicker API
   */
  DatePicker.prototype = {


    /**
     * configure functionality
     */
    config: function(options) {
      if (!this._o) {
        this._o = extend({}, defaults, true);
      }

      // Start and end date
      this._s = null;
      this._e = null;

      // Interval days between start and end date
      this._i = null;

      var opts = extend(this._o, options, true);

      opts.isRTL = !!opts.isRTL;

      if (!isArray(opts.dataFields) || opts.dataFields.length === 0) {
        throw "You must include one or two fields as options";
      }

      // Multiple fields aka range
      opts.multiple = opts.dataFields.length > 1;

      this._p = opts.parser;

      this.createFields(opts, opts.dataFields);

      opts.theme = (typeof opts.theme) == 'string' && opts.theme ? opts.theme : null;

      opts.disableWeekends = !!opts.disableWeekends;

      opts.disableDayFn = (typeof opts.disableDayFn) == "function" ? opts.disableDayFn : null;

      if (!isDate(opts.minDate)) {
        opts.minDate = false;
      }
      if (!isDate(opts.maxDate)) {
        opts.maxDate = false;
      }
      if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
        opts.maxDate = opts.minDate = false;
      }
      if (opts.minDate) {
        this.setMinDate(opts.minDate)
      }
      if (opts.maxDate) {
        setToStartOfDay(opts.maxDate);
        opts.maxYear = opts.maxDate.getFullYear();
        opts.maxMonth = opts.maxDate.getMonth();
      }

      if (isArray(opts.yearRange)) {
        var fallback = new Date().getFullYear() - 10;
        opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
        opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
      } else {
        opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
        if (opts.yearRange > 100) {
          opts.yearRange = 100;
        }
      }

      return opts;
    },

    createFields: function(opts, fields) {
      var hasParser = (opts.parser != null);

      opts.fields = [];

      forEach(fields, function(field, index){
        var date;

        // We clone the field
        var input = field.cloneNode();

        input.setAttribute('id', "pika-" + field.id);
        input.setAttribute('data-pika-field', field.id);
        input.setAttribute('readonly', true);
        input.removeAttribute('name');

        if (hasParser && field.value) {
          date = opts.parser.parse(field.value, opts.dataFormat);
          input.value = opts.parser.format(date, opts.format);
        }

        field.setAttribute('type', 'hidden');

        addClass(input, 'pika-trigger');
        addClass(input, 'pika-' + (index === 0 ? 'in' : 'out'));
        addClass(field, 'pika-data-' + (index === 0 ? 'in' : 'out'));

        field.parentNode.insertBefore(input, field.nextSibling);

        opts.fields.push(input);

      });
    },

    /**
     * return a formatted string of the current selection (using the formatter function if available)
     */
    toString: function(field, format) {
      var date = this._s;

      if (field) {
        date = hasClass(field, 'pika-in') ? this._s : this._e;
      }
      return !isDate(date) ? '' :
             this.hasParser ? this._p.format(date, format) : date.toDateString();
    },

    /**
     * return a Date object of the current selection
     */
    getDate: function(which) {
      var date = this._s;
      if (which && which === "out") {
        date = this._e;
      }

      return isDate(date) ? new Date(date.getTime()) : null;
    },

    setValue: function(field, value) {
      field.value = value;
    },
    /**
     * set the current selection
     */
    setDate: function(date, preventOnSelect) {

      if (!date) {

        if (this._w === "in") {
          this._s = null;
        } else {
          this._e = null;
        }

        if (this._f) {
          this.setValue(this._f, '');

          if (!this._f.ref) {
            this._f.ref = document.getElementById(this._f.getAttribute('data-pika-field'));
          }

          this.setValue(this._f.ref, '');
          fireEvent(this._f, 'change', {
            firedBy: this
          });
        }

        return this.draw();
      }

      if (typeof date === 'string') {
        date = new Date(Date.parse(date));
      }

      if (!isDate(date)) {
        return;
      }

      var min = this._o.minDate,
          max = this._o.maxDate,
          self = this,
          result, tmp;

      if (isDate(min) && date < min) {
        date = min;
      } else if (isDate(max) && date > max) {
        date = max;
      }

      result = new Date(date.getTime());

      if (this._w === "in") {
        this._s = result;
        setToStartOfDay(this._s);
        this.gotoDate(this._s);
      } else if (this._w === "out"){
        this._e = result;
        setToStartOfDay(this._e);
        this.gotoDate(this._e);
      }

      if (this._f) {
        this.setValue(this._f, this.toString(this._f, this._o.format));
        this.setValue(this._f.ref, this.toString(this._f, this._o.dataFormat));
        fireEvent(this._f, 'change', {
          firedBy: this
        });
      }

      if (this._s && this._e) {
        if (this._s.getTime() > this._e.getTime()) {
          this._e = new Date(this._s);
          this._e.setDate(this._e.getDate() + this._i);
        }

        // If same day is selected, add one day to end date
        if (this._s.getTime() == this._e.getTime()) {
          this._e = new Date(this._s);
          this._e.setDate(this._e.getDate() + 1);
        }

        forEach(this._o.fields, function(field){
          var ref = field.getAttribute('data-pika-field'),
              dataField = document.getElementById(ref);

          self.setValue(field, self.toString(field, self._o.format));
          self.setValue(dataField, self.toString(field, self._o.dataFormat));

          fireEvent(field, 'change', {
            firedBy: self
          });
        })

        this._i = Math.round(Math.abs((this._e.getTime() - this._s.getTime())/(24*60*60*1000)));
      }

      if (!preventOnSelect && typeof this._o.onSelect === 'function') {
        this._o.onSelect.call(this, this.getDate(this._w));
      }

      if (this._w === "in" && this._e == null) {
        forEach(this._o.fields, function(field, index){
          if (hasClass(field, 'pika-out')) {
            fireEvent(field, 'focus');
            setToStartOfDay(self._s);
            self.gotoDate(self._s);
          }
        });
      }
    },

    getDiff: function() {
      var result;

      if (this._o.multiple) {
        if (this._e && this._s) {
          result = (this._e - this._s)/(1000*60*60*24);
        } else {
          result = 0
        }
      } else {
        result = 0;
      }

      return result;
    },

    /**
     * change view to a specific date
     */
    gotoDate: function(date) {
      var newCalendar = true;

      if (!isDate(date)) {
        return;
      }

      if (this.calendars) {
        var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
          lastVisibleDate = new Date(this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1),
          visibleDate = date.getTime();
        // get the end of the month
        lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
        lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
        newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
      }

      if (newCalendar) {
        this.calendars = [{
          month: date.getMonth(),
          year: date.getFullYear()
        }];
      }

      this.adjustCalendars();
    },

    adjustCalendars: function() {
      this.calendars[0] = adjustCalendar(this.calendars[0]);
      this.draw();
    },

    gotoToday: function() {
      this.gotoDate(new Date());
    },

    /**
     * change view to a specific month (zero-index, e.g. 0: January)
     */
    gotoMonth: function(month) {
      if (!isNaN(month)) {
        this.calendars[0].month = parseInt(month, 10);
        this.adjustCalendars();
      }
    },

    nextMonth: function() {
      this.calendars[0].month++;
      this.adjustCalendars();
    },

    prevMonth: function() {
      this.calendars[0].month--;
      this.adjustCalendars();
    },

    /**
     * change view to a specific full year (e.g. "2012")
     */
    gotoYear: function(year) {
      if (!isNaN(year)) {
        this.calendars[0].year = parseInt(year, 10);
        this.adjustCalendars();
      }
    },

    /**
     * change the minDate
     */
    setMinDate: function(value) {
      setToStartOfDay(value);
      this._o.minDate = value;
      this._o.minYear = value.getFullYear();
      this._o.minMonth = value.getMonth();
    },

    /**
     * change the maxDate
     */
    setMaxDate: function(value) {
      this._o.maxDate = value;
    },

    /**
     * refresh the HTML
     */
    draw: function(force) {

      if (!this._v && !force) {
        return;
      }
      var opts = this._o,
        minYear = opts.minYear,
        maxYear = opts.maxYear,
        minMonth = opts.minMonth,
        maxMonth = opts.maxMonth,
        html = '';

      if (this._y <= minYear) {
        this._y = minYear;
        if (!isNaN(minMonth) && this._m < minMonth) {
          this._m = minMonth;
        }
      }
      if (this._y >= maxYear) {
        this._y = maxYear;
        if (!isNaN(maxMonth) && this._m > maxMonth) {
          this._m = maxMonth;
        }
      }

      html += '<div class="pika-lendar">' + renderTitle(this, 0, this.calendars[0].year, this.calendars[0].month, this.calendars[0].year) + this.render(this.calendars[0].year, this.calendars[0].month) + '</div>';

      this.el.innerHTML = html;

      var self = this;

      if (this._f != null && this._f.type !== 'hidden') {
        sto(function() {
          self._f && self._f.focus(); // To avoid glitches running tests, check for null again.
        }, 1);
      }

      if (typeof this._o.onDraw === 'function') {
        sto(function() {
          self._o.onDraw.call(self);
        }, 0);
      }
    },

    adjustPosition: function(field) {

      var pEl = field,
        width = this.el.offsetWidth,
        height = this.el.offsetHeight,
        viewportWidth = window.innerWidth || document.documentElement.clientWidth,
        viewportHeight = window.innerHeight || document.documentElement.clientHeight,
        scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
        left, top, clientRect;

      if (this._o.bounded === true) {
        left = pEl.offsetLeft;
        top = pEl.offsetTop + pEl.offsetHeight;
      } else {
        if (typeof field.getBoundingClientRect === 'function') {
          clientRect = field.getBoundingClientRect();
          left = clientRect.left + window.pageXOffset;
          top = clientRect.bottom + window.pageYOffset;
        } else {
          left = pEl.offsetLeft;
          top = pEl.offsetTop + pEl.offsetHeight;
          while ((pEl = pEl.offsetParent)) {
            left += pEl.offsetLeft;
            top += pEl.offsetTop;
          }
        }

        // default position is bottom & left
        if ((this._o.reposition && left + width > viewportWidth) ||
          (
            this._o.position.indexOf('right') > -1 &&
            left - width + field.offsetWidth > 0
          )
        ) {
          left = left - width + field.offsetWidth;
        }
        if ((this._o.reposition && top + height > viewportHeight + scrollTop) ||
          (
            this._o.position.indexOf('top') > -1 &&
            top - height - field.offsetHeight > 0
          )
        ) {
          top = top - height - field.offsetHeight;
        }
      }

      this.el.style.position = 'absolute';
      this.el.style.left = left + 'px';
      this.el.style.top = top + 'px';
    },

    /**
     * render HTML for a particular month
     */
    render: function(year, month) {
      var opts = this._o,
        now = new Date(),
        days = getDaysInMonth(year, month),
        before = new Date(year, month, 1).getDay(),
        data = [],
        row = [];
      setToStartOfDay(now);
      if (opts.firstDay > 0) {
        before -= opts.firstDay;
        if (before < 0) {
          before += 7;
        }
      }
      var cells = days + before,
        after = cells;
      while (after > 7) {
        after -= 7;
      }
      cells += 7 - after;
      for (var i = 0, r = 0; i < cells; i++) {
        var day = new Date(year, month, 1 + (i - before)),
          isBetween = false,
          isSelected = false,
          isSelectedIn = false,
          isSelectedOut = false,
          isToday = compareDates(day, now),
          isEmpty = i < before || i >= (days + before),
          isDisabled = (opts.minDate && day < opts.minDate) ||
          (opts.maxDate && day > opts.maxDate) ||
          (opts.disableWeekends && isWeekend(day)) ||
          (opts.disableDayFn && opts.disableDayFn(day));

        if (isDate(this._s)) {
          isSelected = compareDates(day, this._s);
          isSelectedIn = true;
        }

        if (!isDisabled && isDate(this._s) && hasClass(this._f, 'pika-out')) {
          isDisabled = day < this._s;
        }

        if (isDate(this._e) && !isSelected) {
          isSelected = compareDates(day, this._e);
          isSelectedOut = true;
        }

        // Find out why in single fiel this._e is set
        if (isDate(this._s) && isDate(this._e)){
          isBetween = (day > this._s && day < this._e);
        }

        if (!isSelected) {
          isSelectedIn = false;
          isSelectedOut = false;
        }

        row.push(renderDay(1 + (i - before), month, year, isSelected, isToday, isDisabled, isEmpty, isBetween, isSelectedIn, isSelectedOut));

        if (++r === 7) {
          data.push(renderRow(row, opts.isRTL));
          row = [];
          r = 0;
        }
      }
      return renderTable(opts, data);
    },

    isVisible: function() {
      return this._v;
    },

    setCallback: function(fn, which) {
      which = which || 'onSelect';
      this._o[which] = fn;
    },

    show: function(field) {

      var fieldDate, ref;

      if (!field) {
        field = this._o.fields[0];
      }

      ref = field.getAttribute('data-pika-field');

      this._f = field;
      this._f.ref = document.getElementById(ref);

      if (!this._v) {
        removeClass(this.el, 'is-hidden');
        this._v = true;
        this._w = hasClass(field, 'pika-in') ? "in" : "out";

        if (this.hasParser && field.value) {
          fieldDate = this._p.parse(field.value, this._o.format);
        } else {
          fieldDate = new Date(Date.parse(field.value));
        }

        if (isDate(fieldDate)) {
          this.gotoDate(fieldDate);
        } else {
          // If field is pika-out we show the start date if it's present
          if (hasClass(field, 'pika-out') && this._s != null) {
            this.gotoDate(this._s);
          } else {
            this.gotoDate(new Date());
          }
        }

        addEvent(document, 'click', this._onClick);
        this.adjustPosition(field);

        if (typeof this._o.onOpen === 'function') {
          this._o.onOpen.call(this);
        }
      }
    },

    which: function() {
      return this._w;
    },

    hide: function() {
      var v = this._v;
      if (v !== false) {
        removeEvent(document, 'click', this._onClick);
        this.el.style.position = 'absolute'; // reset
        this.el.style.left = 'auto';
        this.el.style.top = 'auto';
        addClass(this.el, 'is-hidden');
        this._v = false;
        this._f = null;
        if (v !== undefined && typeof this._o.onClose === 'function') {
          this._o.onClose.call(this);
        }
      }
    },

    /**
     * Delete component
     */
    destroy: function() {
      var self = this;

      this.hide();
      removeEvent(this.el, 'mousedown', this._onMouseDown, true);
      removeEvent(this.el, 'touchstart', this._onMouseDown, true);
      removeEvent(this.el, 'change', this._onChange);

      forEach(this._o.fields, function(field){
        field.blur();
        removeClass(field, 'pika-trigger');
        removeClass(field, 'pika-in');
        removeClass(field, 'pika-out');
        removeEvent(field, 'change', self._onInputChange);
        removeEvent(field, 'click', self._onInputClick);
        removeEvent(field, 'focus', self._onInputFocus);

        field.parentNode.removeChild(field);
      })

      forEach(this._o.dataFields, function(field){
        removeClass(field, 'pika-data-in');
        removeClass(field, 'pika-data-out');
        field.setAttribute('type', 'text');
      })

      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }
    }

  };

  return DatePicker;

}));
