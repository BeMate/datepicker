DatePicker
========

### A refreshing JavaScript Datepicker

* Lightweight (less than 5kb minified and gzipped)
* No dependencies (but includes a parser option to format dates results)
* Modular CSS classes for easy styling

## Usage

**DatePicker** needs to be bound to an input field or two for handle ranges:

```html
<input type="text" id="datepicker">
```

Add the JavaScript to the end of your document:

```html
<script src="datepicker.js"></script>
<script>
    var picker = new DatePicker({ fields: [document.getElementById('datepicker')] });
</script>
```

For advanced formatting pass a parser object prior to DatePicker:  
See the examples folder for a full version.

```html
<input type="text" id="datepicker" value="9 Oct 2014">

<script src="dates.js"></script>
<script src="datepicker.js"></script>
<script>
    var picker = new DatePicker({
        fields: [document.getElementById('datepicker')],
        parser: Dates,
        format: 'D MMMM YYYY',
        onSelect: function() {
            console.log(this.getMoment().format('Do MMMM YYYY'));
        }
    });
</script>
```

### Configuration

As the examples demonstrate above
DatePicker has many useful options:

* `fields` bind the datepicker to a form field or two
* `position` preferred position of the datepicker relative to the form field, e.g.: `top right`, `bottom right` **Note:** automatic adjustment may occur to avoid datepicker from being displayed outside the viewport, see [positions example][] (default to 'bottom left')
* `reposition` can be set to false to not reposition datepicker within the viewport, forcing it to take the configured `position` (default: true)
* `parser` to manage an output format for `.toString()` and `field` value
* `format` the default output format for `.toString()` and `field` value (requires a parser for custom formatting)
* `firstDay` first day of the week (0: Sunday, 1: Monday, etc)
* `minDate` the minimum/earliest date that can be selected (this should be a native Date object - e.g. `new Date()` or `moment().toDate()`)
* `maxDate` the maximum/latest date that can be selected (this should be a native Date object - e.g. `new Date()` or `moment().toDate()`)
* `disableWeekends` disallow selection of Saturdays or Sundays
* `disableDayFn` callback function that gets passed a Date object for each day in view. Should return true to disable selection of that day.
* `yearRange` number of years either side (e.g. `10`) or array of upper/lower range (e.g. `[1900,2015]`)
* `isRTL` reverse the calendar for right-to-left languages
* `i18n` language defaults for month and weekday names (see internationalization below)
* `yearSuffix` additional text to append to the year in the title
* `showMonthAfterYear` render the month after year in the title (default `false`)
* `theme` define a classname that can be used as a hook for styling different themes, see [theme example][] (default `null`)
* `onSelect` callback function for when a date is selected
* `onOpen` callback function for when the picker becomes visible
* `onClose` callback function for when the picker is hidden
* `onDraw` callback function for when the picker draws a new month

## Methods

You can control the date picker after creation:

```javascript
var picker = new DatePicker({ fields: [document.getElementById('datepicker')] });
```

### Get and set date

`picker.toString('YYYY-MM-DD')`

Returns the selected date in a string format. If parser exists (recommended) then Datepicker can return any format that the parser understands, otherwise you're stuck with JavaScript's default.

`picker.getDate()`

Returns a basic JavaScript `Date` object of the selected day, or `null` if no selection.

`picker.setDate('2015-01-01')`

Set the current selection. This will be restricted within the bounds of `minDate` and `maxDate` options if they're specified. You can optionally pass a boolean as the second parameter to prevent triggering of the onSelect callback (true), allowing the date to be set silently.

### Change current view

`picker.gotoDate(new Date(2014, 1))`

Change the current view to see a specific date. This example will jump to February 2014 ([month is a zero-based index][mdn_date]).

`picker.gotoToday()`

Shortcut for `picker.gotoDate(new Date())`

`picker.gotoMonth(2)`

Change the current view by month (0: January, 1: Februrary, etc).

`picker.nextMonth()`
`picker.prevMonth()`

Go to the next or previous month (this will change year if necessary).

`picker.gotoYear()`

Change the year being viewed.

`picker.setMinDate()`

Update the minimum/earliest date that can be selected.

`picker.setMaxDate()`

Update the maximum/latest date that can be selected.

### Show and hide datepicker

`picker.isVisible()`

Returns `true` or `false`.

`picker.show()`

Make the picker visible.

`picker.adjustPosition()`

Recalculate and change the position of the picker.

`picker.hide()`

Hide the picker making it invisible.

`picker.destroy()`

Hide the picker and remove all event listeners — no going back!

### Internationalization

The default `i18n` configuration format looks like this:

```javascript
i18n: {
    previousMonth : 'Previous Month',
    nextMonth     : 'Next Month',
    months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
    weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
}
```

You must provide 12 months and 7 weekdays (with abbreviations). Always specify weekdays in this order with Sunday first. You can change the `firstDay` option to reorder if necessary (0: Sunday, 1: Monday, etc). You can also set `isRTL` to `true` for languages that are read right-to-left.

## Browser Compatibility

* IE 7+
* Chrome 8+
* Firefox 3.5+
* Safari 3+
* Opera 10.6+

* * *

## Authors

Original work for the Pikaday project belongs to David Bushell [http://dbushell.com][Bushell] [@dbushell][Bushell Twitter] and Ramiro Rikkert [GitHub][Rikkert] [@RamRik][Rikkert Twitter].

Copyright © 2015 Buti | BSD & MIT license

  [issues]:      https://github.com/nobuti/datepicker/issues                       "Issue tracker"
  [mdn_date]:    https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date  "Date"
  [Bushell]:     http://dbushell.com/                                             "dbushell.com"
  [Bushell Twitter]: https://twitter.com/dbushell                                 "@dbushell"
  [Rikkert]:     https://github.com/rikkert                                       "Rikkert GitHub"
  [Rikkert Twitter]: https://twitter.com/ramrik                                   "@ramrik"
