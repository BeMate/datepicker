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
    var picker = new Pikaday({ fields: [document.getElementById('datepicker')] });
</script>
```

For advanced formatting pass a parser object prior to DatePicker:  
See the [parser example][] for a full version.

```html
<input type="text" id="datepicker" value="9 Oct 2014">

<script src="dates.js"></script>
<script src="datepicker.js"></script>
<script>
    var picker = new Pikaday({
        fields: [document.getElementById('datepicker')],
        parser: Dates,
        format: 'D MMM YYYY',
        onSelect: function() {
            console.log(this.getMoment().format('Do MMMM YYYY'));
        }
    });
</script>
```

### Configuration

As the examples demonstrate above
Pikaday has many useful options:

* `fields` bind the datepicker to a form field or two
* `position` preferred position of the datepicker relative to the form field, e.g.: `top right`, `bottom right` **Note:** automatic adjustment may occur to avoid datepicker from being displayed outside the viewport, see [positions example][] (default to 'bottom left')
* `reposition` can be set to false to not reposition datepicker within the viewport, forcing it to take the configured `position` (default: true)
* `format` the default output format for `.toString()` and `field` value (requires [Moment.js][moment] for custom formatting)
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
var picker = new Pikaday({ field: document.getElementById('datepicker') });
```

### Get and set date

`picker.toString('YYYY-MM-DD')`

Returns the selected date in a string format. If parser exists (recommended) then Datepicker can return any format that the parser understands, otherwise you're stuck with JavaScript's default.

`picker.getDate()`

Returns a basic JavaScript `Date` object of the selected day, or `null` if no selection.

`picker.setDate('2015-01-01')`

Set the current selection. This will be restricted within the bounds of `minDate` and `maxDate` options if they're specified. You can optionally pass a boolean as the second parameter to prevent triggering of the onSelect callback (true), allowing the date to be set silently.

`picker.getMoment()`

Returns a [Moment.js][moment] object for the selected date (Moment must be loaded before Pikaday).

`picker.setMoment(moment('14th February 2014', 'DDo MMMM YYYY'))`

Set the current selection with a [Moment.js][moment] object (see `setDate` for details).

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


## Extensions

### Timepicker

Pikaday is a pure datepicker. It will not support picking a time of day. However, there have been efforts to add time support to Pikaday.  
See [#1][issue1] and [#18][issue18]. These reside in their own fork.

You can use the work [@owenmead][owenmead] did most recently at [owenmead/Pikaday][owen Pika]  
A more simple time selection approach done by [@xeeali][xeeali] at [xeeali/Pikaday][xeeali Pika] is based on version 1.2.0.  
Also [@stas][stas] has a fork [stas/Pikaday][stas Pika], but is now quite old


## Browser Compatibility

* IE 7+
* Chrome 8+
* Firefox 3.5+
* Safari 3+
* Opera 10.6+

[![browser compatibility](https://ci.testling.com/rikkert/pikaday.png)
](https://ci.testling.com/rikkert/pikaday)


* * *

## Authors

* David Bushell [http://dbushell.com][Bushell] [@dbushell][Bushell Twitter]
* Ramiro Rikkert [GitHub][Rikkert] [@RamRik][Rikkert Twitter]

Thanks to [@shoogledesigns][shoogledesigns] for the name.

Copyright © 2014 David Bushell | BSD & MIT license

  [Pikaday]:     http://dbushell.github.com/Pikaday/                              "Pikaday"
  [moment]:      http://momentjs.com/                                             "moment.js"
  [browserify]:  http://browserify.org/                                           "browserify"
  [screenshot]:  https://raw.github.com/dbushell/Pikaday/gh-pages/screenshot.png  "Screenshot"
  [issues]:      https://github.com/dbushell/Pikaday/issues                       "Issue tracker"
  [gem]:         https://rubygems.org/gems/pikaday-gem                            "RoR gem"
  [mdn_date]:    https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date  "Date"
  [Bushell]:     http://dbushell.com/                                             "dbushell.com"
  [Bushell Twitter]: https://twitter.com/dbushell                                 "@dbushell"
  [Rikkert]:     https://github.com/rikkert                                       "Rikkert GitHub"
  [Rikkert Twitter]: https://twitter.com/ramrik                                   "@ramrik"
  [shoogledesigns]:  https://twitter.com/shoogledesigns/status/255209384261586944 "@shoogledesigns"
  [issue1]:      https://github.com/dbushell/Pikaday/issues/1                     "Issue 1"
  [issue18]:     https://github.com/dbushell/Pikaday/issues/18                    "Issue 18"
  [stas]:        https://github.com/stas                                          "@stas"
  [stas Pika]:   https://github.com/stas/Pikaday                                  "Pikaday"
  [owenmead]:    https://github.com/owenmead                                      "@owenmead"
  [owen Pika]:   https://github.com/owenmead/Pikaday                              "Pikaday"
  [xeeali]:      https://github.com/xeeali                                        "@xeeali"
  [xeeali Pika]: https://github.com/xeeali/Pikaday                                "Pikaday"
  [moment.js example]: http://dbushell.github.com/Pikaday/examples/moment.html    "Pikaday w/ moment.js"
  [jQuery example]: http://dbushell.github.com/Pikaday/examples/jquery.html       "Pikaday w/ jQuery"
  [AMD example]: http://dbushell.github.com/Pikaday/examples/amd.html             "Pikaday w/ AMD"
  [jQuery AMD example]: http://dbushell.github.com/Pikaday/examples/jquery-amd.html "Pikaday w/ jQuery + AMD"
  [trigger example]: http://dbushell.github.com/Pikaday/examples/trigger.html     "Pikaday using custom trigger"
  [positions example]: http://dbushell.github.com/Pikaday/examples/positions.html "Pikaday using different position options"
  [container example]: http://dbushell.github.com/Pikaday/examples/container.html "Pikaday using custom calendar container"
  [theme example]: http://dbushell.github.com/Pikaday/examples/theme.html         "Pikaday using multiple themes"
