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
          fields: [document.getElementById('date-field')],
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
      var field = document.getElementById('date-field');

      // To open the datepicker
      fireEvent(field, 'focus');

      expect(calendar.parentNode).toBe(document.getElementById('container'));
      expect(calendar.offsetLeft).toBe(field.offsetLeft);
      expect(calendar.offsetTop).toBe(field.offsetTop + field.offsetHeight);
    });

    it("should be open in the month dicted by the field", function() {
      var node = document.getElementById('date-field');

      expect(node).not.toBeNull();
      expect(node.value).toEqual('2015-06-13');

      // To open the datepicker
      fireEvent(node, 'focus');

      expect(document.querySelector('.pika-single.is-single').className).not.toMatch(/is-hidden/);
      expect(document.querySelector('.is-selected-in .pika-button').firstChild.textContent).toBe("13");
      expect(document.querySelectorAll('.pika-title .pika-label')[0].firstChild.textContent).toBe("June");
    });

    it("should be only one selected day", function() {
      var node = document.getElementById('date-field'),
          buttons;
      // To open the datepicker
      fireEvent(node, 'focus');

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
      var node = document.getElementById('date-field');
      var invalids = ["14-06-2015", "15-06-2015"];

      var disabledDayHandler = function(day) {
        var date = Dates.format(day, "dd-MM-yyyy");
        var collection = invalids;
        return collection.indexOf(date) !== -1;
      }

      datepicker.setCallback(disabledDayHandler, 'disableDayFn');

      fireEvent(node, 'focus');

      node.value = "2015-06-13";
      fireEvent(node, 'change');

      datepicker.hide();
      fireEvent(node, 'focus');

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
          fields: [document.getElementById('start'), document.getElementById('end')],
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
      var end = document.getElementById('end');

      // To open the datepicker
      fireEvent(start, 'focus');

      expect(calendar.parentNode).toBe(document.getElementById('container-range'));
      expect(calendar.offsetLeft).toBe(start.offsetLeft);
      expect(calendar.offsetTop).toBe(start.offsetTop + start.offsetHeight);

      fireEvent(end, 'focus');
      expect(calendar.offsetLeft).toBe(end.offsetLeft);
      expect(calendar.offsetTop).toBe(end.offsetTop + end.offsetHeight);

    });

    it("should be open in current date if field is blank", function() {
      var node = document.getElementById('start'),
          months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      expect(node.value).toEqual('');

      // To open the datepicker
      fireEvent(node, 'focus');

      expect(document.querySelectorAll('.is-selected-in').length).toBe(0);
      expect(document.querySelectorAll('.is-selected-out').length).toBe(0); // none in the current month
      expect(document.querySelectorAll('.pika-title .pika-label')[0].firstChild.textContent).toBe(months[today.getMonth()]);

      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      expect(document.querySelectorAll('.is-selected-out').length).toBe(1); // End date is prefilled
      expect(document.querySelectorAll('.pika-title .pika-label')[0].firstChild.textContent).toBe(months[nextMonth.getMonth()]);
    });

    it("should be only two selected day and in between days", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end');

      fireEvent(start, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[0], 'mousedown');

      fireEvent(end, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[6], 'mousedown');
      expect(document.querySelectorAll('.is-selected').length).toBe(2);

      fireEvent(end, 'focus');
      expect(document.querySelectorAll('.is-between').length).toBe(5);
    });

    it("should keep the dates interval if start is bigger than ending", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end');

      fireEvent(end, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[0], 'mousedown');

      fireEvent(start, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[6], 'mousedown');

      // To force a repaint
      fireEvent(end, 'focus');

      expect(datepicker._e > datepicker._s).toBe(true);
      expect(document.querySelectorAll('.pika-button')[7].parentNode.className).toMatch(/is-selected/);
    });

    it("should not be able to select an ending date before the start date", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end');

      fireEvent(start, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      fireEvent(end, 'focus');
      expect(document.querySelectorAll('.pika-button')[0].parentNode.className).toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[1].parentNode.className).toMatch(/is-disabled/);
    });

    it("should show the start date if ending date is not defined", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end'),
          months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      fireEvent(start, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      fireEvent(end, 'focus');
      expect(document.querySelectorAll('.pika-title .pika-label')[0].firstChild.textContent).toBe(months[nextMonth.getMonth()]);
    });

    it("should pass the focus to ending date when start date is set and ending date is blank", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end');

      datepicker._f = end;
      datepicker._w = "out";
      datepicker.setDate();

      fireEvent(start, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      // Because we set the field when has focus
      expect(datepicker._f).toEqual(end);
    });

    it("should be return 0 days diff if any dates it's not defined yet", function() {
      expect(datepicker.getDiff()).toBe(0);
    });

    it("should be return days diff properly when the two dates are defined", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end');

      fireEvent(start, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[0], 'mousedown');

      fireEvent(end, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[6], 'mousedown');

      expect(datepicker.getDiff()).toBe(6);

      fireEvent(start, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(datepicker.getDiff()).toBe(4);

      fireEvent(start, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[12], 'mousedown');

      // To force a repaint for testing visually
      fireEvent(end, 'focus');

      expect(datepicker.getDiff()).toBe(4);
    });

    it("should disabled dates properly", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end');

      fireEvent(start, 'focus');
      start.value = "2015-06-13";
      fireEvent(start, 'change');

      fireEvent(end, 'focus');
      end.value = "2015-06-20";
      fireEvent(end, 'change');

      var invalids_in = ["14-06-2015", "15-06-2015"];
      var invalids_out = ["18-06-2015", "19-06-2015"];

      var disabledDayHandler = function(day) {
        var collection = datepicker.which() === "in" ? invalids_in : invalids_out;
        var date = Dates.format(day, "dd-MM-yyyy");
        return collection.indexOf(date) !== -1;
      }

      datepicker.setCallback(disabledDayHandler, 'disableDayFn');

      datepicker.hide();

      fireEvent(start, 'focus');

      expect(document.querySelectorAll('.pika-button')[13].parentNode.className).toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[14].parentNode.className).toMatch(/is-disabled/);

      fireEvent(end, 'focus');

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
          fields: [document.getElementById('date-field')] ,
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

      fireEvent(node, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(document.getElementById('date-field').value).toBe("03/05/2015");
    });

    it("format 'dd-MM-yyyy'", function() {
      datepicker._o.format = 'dd-MM-yyyy';
      var node = document.getElementById('date-field');

      fireEvent(node, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(document.getElementById('date-field').value).toBe("03-05-2015");
    });

    it("format 'dd.MM.yy'", function() {
      datepicker._o.format = 'dd.MM.yy';
      var node = document.getElementById('date-field');

      fireEvent(node, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(document.getElementById('date-field').value).toBe("03.05.15");
    });

    it("format 'dd MMMM yyyy'", function() {

      var format = datepicker._o.format = 'dd MMMM yyyy';
      var node = document.getElementById('date-field');

      node.value = Dates.format(Dates.parse(node.value, 'dd/MM/yyyy'), format);

      fireEvent(node, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(document.getElementById('date-field').value).toBe("03 June 2015");
    });

    it("format 'd MMM yyyy'", function() {
      var format = datepicker._o.format = 'd MMM yyyy';
      var node = document.getElementById('date-field');

      node.value = Dates.format(Dates.parse(node.value, 'dd/MM/yyyy'), format);

      fireEvent(node, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      expect(document.getElementById('date-field').value).toBe("3 Jun 2015");
    });

  });
});
