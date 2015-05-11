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
    document.getElementById('end').value = nextMonth.getFullYear() + '-' + (nextMonth.getMonth() + 1)  + '-' + nextMonth.getDate();

    document.getElementById('fixture').style.display = 'block';
  });

  afterAll(function(){
    document.getElementById('fixture').style.display = 'none';
  });

  describe('Single datepicker', function () {

    var datepicker;

    beforeEach(function() {
      datepicker = new DatePicker({
          fields: [document.getElementById('date-field')] ,
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
  });

  describe('Range datepicker', function () {

    var datepicker;

    beforeEach(function() {
      datepicker= new DatePicker({
          fields: [document.getElementById('start'), document.getElementById('end')] ,
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

    it("should swap the dates if start is bigger than ending", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end');

      fireEvent(end, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[0], 'mousedown');

      fireEvent(start, 'focus');
      fireEvent(document.querySelector('.pika-next'), 'mousedown');
      fireEvent(document.querySelectorAll('.pika-button')[6], 'mousedown');

      expect(datepicker._e > datepicker._s).toBe(true);
    });

    it("should not be able to select an ending date before the start date", function() {
      var start = document.getElementById('start'),
          end = document.getElementById('end');

      fireEvent(start, 'focus');
      fireEvent(document.querySelectorAll('.pika-button')[2], 'mousedown');

      fireEvent(end, 'focus');
      expect(document.querySelectorAll('.pika-button')[0].parentNode.className).toMatch(/is-disabled/);
      expect(document.querySelectorAll('.pika-button')[1].parentNode.className).toMatch(/is-disabled/);
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
