describe("DatePicker", function() {

  var fireEvent = function(el, eventName, data) {
    var ev;

    if (document.createEvent) {
      ev = document.createEvent('HTMLEvents');
      ev.initEvent(eventName, true, false);
      el.dispatchEvent(ev);
    } else if (document.createEventObject) {
      ev = document.createEventObject();
      el.fireEvent('on' + eventName, ev);
    }
  }

  var today = new Date(),
        nextMonth = new Date(),
        currentDay = today.getDate();

  nextMonth.setMonth(nextMonth.getMonth() + 1);

  beforeAll(function(){
    document.getElementById('fixture').style.display = 'block';
  });

  afterAll(function(){
    document.getElementById('fixture').style.display = 'none';
  });

  describe('Single datepicker', function () {

    var datepicker;

    beforeEach(function() {
      datepicker = new DatePicker({
        dataFields: [document.getElementById('date-field')],
        bounded: true,
        firstDay: 1,
        minDate: new Date('2000-01-01'),
        maxDate: new Date('2020-12-31'),
        yearRange: [2000, 2020]
      });
    });

    afterEach(function() {
      datepicker.destroy();
    });

    it("should be create the calendar", function() {
      var calendar = document.querySelector('.pika-single.is-single');

      expect(datepicker).not.toBeNull();
      expect(calendar).not.toBeNull();
    });

    it("should be rendered inside the common parent", function() {
      var calendar = document.querySelector('.pika-single.is-single');
      var datafield = document.getElementById('date-field');
      var field = document.getElementById('pika-date-field');
      // To open the datepicker
      fireEvent(field, 'focus');

      expect(calendar.parentNode).toBe(document.getElementById('container'));
      expect(calendar.offsetLeft).toBe(field.offsetLeft);
      expect(calendar.offsetTop).toBe(field.offsetTop + field.offsetHeight);
    });

    it("should be open in the month dicted by the field", function() {
      var node = document.getElementById('date-field');
      var field = document.getElementById('pika-date-field');

      expect(node).not.toBeNull();
      expect(node.value).toEqual('2015-06-13');
      expect(field.value).toEqual('2015-06-13');

      // To open the datepicker
      fireEvent(field, 'focus');

      expect(document.querySelector('.pika-single.is-single').className).not.toMatch(/is-hidden/);
      expect(document.querySelector('.is-selected-in .pika-button').firstChild.textContent).toBe("13");
      expect(document.querySelectorAll('.pika-title .pika-label')[0].firstChild.textContent).toBe("June");
    });

    it("should be only one selected day", function() {
      var field = document.getElementById('pika-date-field'),
          buttons;
      // To open the datepicker
      fireEvent(field, 'focus');

      expect(document.querySelectorAll('.is-selected').length).toBe(1);

      buttons = document.querySelectorAll('.pika-button');
      fireEvent(buttons[21], 'mousedown');

      expect(document.querySelector('.is-selected-in .pika-button').firstChild.textContent).not.toBe("13");
      expect(document.querySelector('.is-selected-in .pika-button').firstChild.textContent).toEqual("22");
      expect(document.querySelectorAll('.is-selected').length).toBe(1);
    });

    it("should be return 0 days diff", function() {
      expect(datepicker.getDiff()).toBe(0);
    });

    it("should disabled dates properly", function() {
      var field = document.getElementById('pika-date-field');
      var invalids = ["14-06-2015", "15-06-2015"];

      var disabledDayHandler = function(day) {
        var date = Dates.format(day, "dd-MM-yyyy");
        var collection = invalids;
        return collection.indexOf(date) !== -1;
      }

      datepicker.setCallback(disabledDayHandler, 'disableDayFn');

      fireEvent(field, 'focus');

      field.value = "2015-06-13";
      fireEvent(field, 'change');

      datepicker.hide();
      fireEvent(field, 'focus');

      expect(document.querySelectorAll('.pika-button')[13].parentNode.className).toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[14].parentNode.className).toMatch(/is-disabled/);
    });
  });

  describe('Range datepicker', function () {

    var datepicker;

    beforeEach(function() {
      document.getElementById('start').value = "";
      document.getElementById('end').value = nextMonth.getFullYear() + '-' + (nextMonth.getMonth() + 1)  + '-' + nextMonth.getDate();

      datepicker= new DatePicker({
        dataFields: [document.getElementById('start'), document.getElementById('end')],
        bounded: true,
        firstDay: 1,
        minDate: new Date('2000-01-01'),
        maxDate: new Date('2020-12-31'),
        yearRange: [2000, 2020]
      });
    });

    afterEach(function() {
      datepicker.destroy();
    });

    it("should be create only one calendar", function() {
      var calendar = document.querySelectorAll('.pika-single.is-multiple');

      expect(datepicker).not.toBeNull();
      expect(calendar.length).toBe(1);
    });

    it("should be rendered inside the common parent", function() {
      var calendar = document.querySelector('.pika-single.is-multiple');
      var start = document.getElementById('start');
      var startField = document.getElementById('pika-start');
      var end = document.getElementById('end');
      var endField = document.getElementById('pika-end');

      // To open the datepicker
      fireEvent(startField, 'focus');

      expect(calendar.parentNode).toBe(document.getElementById('container-range'));
      expect(calendar.offsetLeft).toBe(startField.offsetLeft);
      expect(calendar.offsetTop).toBe(startField.offsetTop + startField.offsetHeight);

      fireEvent(endField, 'focus');
      expect(calendar.offsetLeft).toBe(endField.offsetLeft);
      expect(calendar.offsetTop).toBe(endField.offsetTop + endField.offsetHeight);

    });

    it("should be open in current date if field is blank", function() {
      var node = document.getElementById('start'),
          field = document.getElementById('pika-start'),
          months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      expect(node.value).toEqual('');
      expect(field.value).toEqual('');

      // To open the datepicker
      fireEvent(field, 'focus');

      expect(document.querySelectorAll('.is-selected-in').length).toBe(0);
      expect(document.querySelectorAll('.is-selected-out').length).toBe(0); // none in the current month
      expect(document.querySelectorAll('.pika-title .pika-label')[0].firstChild.textContent).toBe(months[today.getMonth()]);

      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      expect(document.querySelectorAll('.is-selected-out').length).toBe(1); // End date is prefilled
      expect(document.querySelectorAll('.pika-title .pika-label')[0].firstChild.textContent).toBe(months[nextMonth.getMonth()]);
    });

    it("should be only two selected day and in between days", function() {
      var startField = document.getElementById('pika-start');
      var endField = document.getElementById('pika-end');

      fireEvent(startField, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[0], 'mousedown');

      fireEvent(endField, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[6], 'mousedown');
      expect(document.querySelectorAll('.is-selected').length).toBe(2);

      fireEvent(endField, 'focus');
      expect(document.querySelectorAll('.is-between').length).toBe(5);
    });

    it("should keep the dates interval if start is bigger than ending", function() {
      var startField = document.getElementById('pika-start');
      var endField = document.getElementById('pika-end');

      fireEvent(endField, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[0], 'mousedown');

      fireEvent(startField, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[6], 'mousedown');

      // To force a repaint
      fireEvent(endField, 'focus');

      expect(datepicker._e > datepicker._s).toBe(true);
      expect(document.querySelectorAll('.pika-button')[7].parentNode.className).toMatch(/is-selected/);
    });

    it("should not be able to select an ending date before the start date", function() {
      var startField = document.getElementById('pika-start');
      var endField = document.getElementById('pika-end');

      fireEvent(startField, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      fireEvent(endField, 'focus');
      expect(document.querySelectorAll('.pika-button')[0].parentNode.className).toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[1].parentNode.className).toMatch(/is-disabled/);
    });

    it("should show the start date if ending date is not defined", function() {
      var startField = document.getElementById('pika-start'),
          endField = document.getElementById('pika-end'),
          months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      fireEvent(startField, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      fireEvent(endField, 'focus');
      expect(document.querySelectorAll('.pika-title .pika-label')[0].firstChild.textContent).toBe(months[nextMonth.getMonth()]);
    });

    it("should pass the focus to ending date when start date is set and ending date is blank", function() {
      var start = document.getElementById('start');
      var end = document.getElementById('end');
      var startField = document.getElementById('pika-start');
      var endField = document.getElementById('pika-end');

      datepicker._f = endField;
      datepicker._w = "out";
      datepicker.setDate();

      fireEvent(startField, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      // Because we set the field when has focus
      expect(datepicker._f).toEqual(endField);
    });

    it("should be return 0 days diff if any dates it's not defined yet", function() {
      expect(datepicker.getDiff()).toBe(0);
    });

    it("should be return days diff properly when the two dates are defined", function() {
      var startField = document.getElementById('pika-start');
      var endField = document.getElementById('pika-end');

      fireEvent(startField, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[0], 'mousedown');

      fireEvent(endField, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[6], 'mousedown');

      expect(datepicker.getDiff()).toBe(6);

      fireEvent(startField, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(datepicker.getDiff()).toBe(4);

      fireEvent(startField, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[12], 'mousedown');

      // To force a repaint for testing visually
      fireEvent(endField, 'focus');

      expect(datepicker.getDiff()).toBe(4);
    });

    it("should disabled dates properly", function() {
      var start = document.getElementById('start');
      var end = document.getElementById('end');
      var startField = document.getElementById('pika-start');
      var endField = document.getElementById('pika-end');

      fireEvent(startField, 'focus');
      startField.value = "2015-06-13";
      fireEvent(startField, 'change');

      fireEvent(endField, 'focus');
      endField.value = "2015-06-20";
      fireEvent(endField, 'change');

      var invalids_in = ["14-06-2015", "15-06-2015"];
      var invalids_out = ["18-06-2015", "19-06-2015"];

      var disabledDayHandler = function(day) {
        var collection = datepicker.which() === "in" ? invalids_in : invalids_out;
        var date = Dates.format(day, "dd-MM-yyyy");
        return collection.indexOf(date) !== -1;
      }

      datepicker.setCallback(disabledDayHandler, 'disableDayFn');

      datepicker.hide();

      fireEvent(startField, 'focus');

      expect(document.querySelectorAll('.pika-button')[13].parentNode.className).toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[14].parentNode.className).toMatch(/is-disabled/);

      fireEvent(endField, 'focus');

      expect(document.querySelectorAll('.pika-button')[13].parentNode.className).not.toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[14].parentNode.className).not.toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[17].parentNode.className).toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[18].parentNode.className).toMatch(/is-disabled/);
    });
  });

  describe('Datepicker with parser', function () {

    var datepicker;

    beforeEach(function() {

      document.getElementById('date-field').value = "11/05/2015"

      datepicker = new DatePicker({
        dataFields: [document.getElementById('date-field')] ,
        firstDay: 1,
        parser: Dates,
        minDate: new Date('2000-01-01'),
        maxDate: new Date('2020-12-31'),
        yearRange: [2000, 2020]
      });
    });

    afterEach(function() {
      datepicker.destroy();
    });

    it("format 'dd/MM/yyyy'", function() {
      var node = document.getElementById('date-field');
      var field = document.getElementById('pika-date-field');

      fireEvent(field, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      // dataFormat: 'yyyy/MM/dd' by default
      expect(node.value).toBe("2015/05/03");
      expect(field.value).toBe("03/05/2015");
    });

    it("format 'dd-MM-yyyy'", function() {
      datepicker._o.format = 'dd-MM-yyyy';
      datepicker._o.dataFormat = 'yyyy-dd-MM';

      var node = document.getElementById('date-field');
      var field = document.getElementById('pika-date-field');

      fireEvent(field, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(node.value).toBe("2015-03-05");
      expect(field.value).toBe("03-05-2015");
    });

    it("format 'dd.MM.yy'", function() {
      datepicker._o.format = 'dd.MM.yy';
      var node = document.getElementById('date-field');
      var field = document.getElementById('pika-date-field');

      fireEvent(field, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(node.value).toBe("2015/05/03");
      expect(field.value).toBe("03.05.15");
    });

    it("format 'dd MMMM yyyy'", function() {

      var format = datepicker._o.format = 'dd MMMM yyyy';
      var node = document.getElementById('date-field');
      var field = document.getElementById('pika-date-field');

      field.value = Dates.format(Dates.parse(node.value, 'dd/MM/yyyy'), format);

      fireEvent(field, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(node.value).toBe("2015/06/03");
      expect(field.value).toBe("03 June 2015");
    });

    it("format 'd MMM yyyy'", function() {
      var format = datepicker._o.format = 'd MMM yyyy';
      var node = document.getElementById('date-field');
      var field = document.getElementById('pika-date-field');

      field.value = Dates.format(Dates.parse(node.value, 'dd/MM/yyyy'), format);

      fireEvent(field, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(node.value).toBe("2015/06/03");
      expect(field.value).toBe("3 Jun 2015");
    });

  });
});
