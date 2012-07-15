(function($){
  $(function(){
    if (!Modernizr.inputtypes["datetime-local"]) {
      var readDateTime = function(dt_str) {
        if (/^\d{4,}-\d\d-\d\dT\d\d:\d\d(?:\:\d\d(?:\.\d+)?)?$/.test(dt_str)) {
          var matchData = /^(\d+)-(\d+)-(\d+)T(\d+):(\d+)(?:\:(\d+)(?:\.(\d+))?)?$/.exec(dt_str);
          var yearPart = parseInt(matchData[1], 10),
            monthPart = parseInt(matchData[2], 10),
            dayPart = parseInt(matchData[3], 10),
            hourPart = parseInt(matchData[4], 10),
            minutePart = parseInt(matchData[5], 10),
            secondPart = (matchData[6] !== undefined) ? parseInt(matchData[6], 10) : 0,
            millisecondPart = (matchData[7] !== undefined) ? matchData[7] : '0';
          while (millisecondPart.length < 3) {
  	        millisecondPart += '0';
          }
          if (millisecondPart.length > 3) {
            millisecondPart = millisecondPart.substring(0, 3)
          }
          millisecondPart = parseInt(millisecondPart, 10);
          var dateObj = new Date();
          dateObj.setFullYear(yearPart);
          dateObj.setMonth(monthPart - 1);
          dateObj.setDate(dayPart);
          dateObj.setHours(hourPart);
          dateObj.setMinutes(minutePart);
          dateObj.setSeconds(secondPart);
          dateObj.setMilliseconds(millisecondPart);
          return dateObj;
        } else throw "Invalid datetime string: " + dt_str;
      };
      var makeDateTimeString = function(date_obj) {
        var dt_arr = [date_obj.getFullYear().toString()];
        dt_arr.push('-');
        if (date_obj.getMonth() < 9) dt_arr.push('0');
        dt_arr.push((date_obj.getMonth() + 1).toString());
        dt_arr.push('-');
        if (date_obj.getDate() < 10) dt_arr.push('0');
        dt_arr.push(date_obj.getDate().toString());
        dt_arr.push('T');
        if (date_obj.getHours() < 10) dt_arr.push('0');
        dt_arr.push(date_obj.getHours().toString());
        dt_arr.push(':');
        if (date_obj.getMinutes() < 10) dt_arr.push('0');
        dt_arr.push(date_obj.getMinutes().toString());
        if (date_obj.getSeconds() > 0 || date_obj.getMilliseconds() > 0) {
          dt_arr.push(':');
          if (date_obj.getSeconds() < 10) dt_arr.push('0');
          dt_arr.push(date_obj.getSeconds().toString());
          if (date_obj.getMilliseconds() > 0) {
            dt_arr.push('.');
            if (date_obj.getMilliseconds() < 100) dt_arr.push('0');
            if (date_obj.getMilliseconds() < 10) dt_arr.push('0');
            dt_arr.push(date_obj.getMilliseconds().toString());
          }
        }
        return dt_arr.join('');
      };
      var makeDateDisplayString = function(date_obj, elem) {
        var $elem = $(elem);
        var day_names = $elem.datepicker( "option", "dayNames" );
        var month_names = $elem.datepicker( "option", "monthNames" );
        var date_arr = [day_names[date_obj.getDay()]];
        date_arr.push(', ');
        date_arr.push(month_names[date_obj.getMonth()]);
        date_arr.push(' ');
        date_arr.push(date_obj.getDate().toString());
        date_arr.push(', ');
        date_arr.push(date_obj.getFullYear().toString());
        return date_arr.join('');
      };
      var makeTimeDisplayString = function(date_obj) {
        var time_arr = new Array();
        var ampm;
        if (date_obj.getHours() == 0) {
          time_arr.push('12');
          ampm = 'AM';
        } else if (date_obj.getHours() > 0 && date_obj.getHours() < 10) {
          time_arr.push('0');
          time_arr.push(date_obj.getHours().toString());
          ampm = 'AM';
        } else if (date_obj.getHours() >= 10 && date_obj.getHours() < 12) {
          time_arr.push(date_obj.getHours().toString());
          ampm = 'AM';
        } else if (date_obj.getHours() == 12) {
          time_arr.push('12');
          ampm = 'PM';
        } else if (date_obj.getHours() > 12 && date_obj.getHours() < 22) {
          time_arr.push('0');
          time_arr.push((date_obj.getHours() - 12).toString());
          ampm = 'PM';
        } else if (date_obj.getHours() >= 22) {
          time_arr.push((date_obj.getHours() - 12).toString());
          ampm = 'PM';
        }
        time_arr.push(':');
        if (date_obj.getMinutes() < 10) time_arr.push('0');
        time_arr.push(date_obj.getMinutes().toString());
        time_arr.push(':');
        if (date_obj.getSeconds() < 10) time_arr.push('0');
        time_arr.push(date_obj.getSeconds().toString());
        if (date_obj.getMilliseconds() > 0) {
          time_arr.push('.');
          if (date_obj.getMilliseconds() % 100 == 0) {
            time_arr.push((date_obj.getMilliseconds() / 100).toString());
          } else if (date_obj.getMilliseconds() % 10 == 0) {
            time_arr.push('0');
            time_arr.push((date_obj.getMilliseconds() / 10).toString());
          } else {
            if (date_obj.getMilliseconds() < 100) time_arr.push('0');
            if (date_obj.getMilliseconds() < 10) time_arr.push('0');
            time_arr.push(date_obj.getMilliseconds().toString());
          }
        }
        time_arr.push(' ');
        time_arr.push(ampm);
        return time_arr.join('');
      };
      var increment = function(hiddenField, dateBtn, timeField, calendarDiv) {
        var $hiddenField = $(hiddenField);
        var value = readDateTime($hiddenField.val());
        var step = $hiddenField.data("step");
        var max = $hiddenField.data("max");
        if (step === undefined || step == 'any') value.setSeconds(value.getSeconds() + 1);
        else value.setSeconds(value.getSeconds() + step);
        if (max !== undefined && value > max) value.setTime(max.getTime());
        $hiddenField.val(makeDateTimeString(value)).change();
        $(dateBtn).text(makeDateDisplayString(value, calendarDiv));
        $(calendarDiv).datepicker("setDate", value);
        $(timeField).val(makeTimeDisplayString(value));
      };
      var decrement = function(hiddenField, dateBtn, timeField, calendarDiv) {
        var $hiddenField = $(hiddenField);
        var value = readDateTime($hiddenField.val());
        var step = $hiddenField.data("step");
        var min = $hiddenField.data("min");
        if (step === undefined || step == 'any') value.setSeconds(value.getSeconds() - 1);
        else value.setSeconds(value.getSeconds() - step);
        if (min !== undefined && value < min) value.setTime(min.getTime());
        $hiddenField.val(makeDateTimeString(value)).change();
        $(dateBtn).text(makeDateDisplayString(value, calendarDiv));
        $(calendarDiv).datepicker("setDate", value);
        $(timeField).val(makeTimeDisplayString(value));
      };
      var incrementDate = function(hiddenField, dateBtn, timeField, calendarDiv) {
        var $hiddenField = $(hiddenField);
        var value = readDateTime($hiddenField.val());
        var step = $hiddenField.data("step");
        var max = $hiddenField.data("max");
        value.setDate(value.getDate() + 1);
        if (max !== undefined && value > max) value.setTime(max.getTime());
        $hiddenField.val(makeDateTimeString(value)).change();
        $(dateBtn).text(makeDateDisplayString(value, calendarDiv));
        $(calendarDiv).datepicker("setDate", value);
        $(timeField).val(makeTimeDisplayString(value));
      };
      var decrementDate = function(hiddenField, dateBtn, timeField, calendarDiv) {
        var $hiddenField = $(hiddenField);
        var value = readDateTime($hiddenField.val());
        var step = $hiddenField.data("step");
        var min = $hiddenField.data("min");
        value.setDate(value.getDate() - 1);
        if (min !== undefined && value < min) value.setTime(min.getTime());
        $hiddenField.val(makeDateTimeString(value)).change();
        $(dateBtn).text(makeDateDisplayString(value, calendarDiv));
        $(calendarDiv).datepicker("setDate", value);
        $(timeField).val(makeTimeDisplayString(value));
      };
      var stepNormalize = function(inDate, hiddenField) {
        var $hiddenField = $(hiddenField);
        var step = $hiddenField.data("step");
        var min = $hiddenField.data("min");
        var max = $hiddenField.data("max");
        if (step !== undefined && step != 'any') {
          var kNum = inDate.getTime();
          var raisedStep = step * 1000;
          if (min !== undefined) {
            var minNum = min.getTime();
            var stepDiff = (kNum - minNum) % raisedStep;
            var stepDiff2 = raisedStep - stepDiff;
            if (stepDiff == 0) return inDate;
            else {
              if (stepDiff > stepDiff2) return new Date(inDate.getTime() + stepDiff2);
              else return new Date(inDate.getTime() - stepDiff);
            }
          } else if (max !== undefined) {
            var maxNum = max.getTime();
            var stepDiff = (maxNum - kNum) % raisedStep;
            var stepDiff2 = raisedStep - stepDiff;
            if (stepDiff == 0) return inDate;
            else {
              if (stepDiff > stepDiff2) return new Date(inDate.getTime() - stepDiff2);
              else return new Date(inDate.getTime() + stepDiff);
            }
          } else return inDate;
        } else return inDate;
      }
      $('input[type="datetime-local"]').each(function(index) {
        var $this = $(this), value, min, max, step;
        if ($this.attr('value') !== undefined && /^\d{4,}-\d\d-\d\dT\d\d:\d\d(?:\:\d\d(?:\.\d+)?)?$/.test($this.attr('value'))) value = readDateTime($this.attr('value'));
        else value = new Date();
        if ($this.attr('min') !== undefined) {
          min = readDateTime($this.attr('min'));
          if (value < min) value.setTime(min.getTime());
        }
        if ($this.attr('max') !== undefined) {
          max = readDateTime($this.attr('max'));
          if (value > max) value.setTime(max.getTime());
        }
        if ($this.attr('step') == 'any') step = 'any';
        else if ($this.attr('step') !== undefined) step = parseFloat($this.attr('step'));
        var hiddenField = document.createElement('input');
        var $hiddenField = $(hiddenField);
        $hiddenField.attr({
          type: "hidden",
          name: $this.attr('name'),
          value: makeDateTimeString(value)
        });
        $hiddenField.data('min', min);
        $hiddenField.data('max', max);
        $hiddenField.data('step', step);

        value = stepNormalize(value, hiddenField);
        $hiddenField.attr('value', makeDateTimeString(value));

        var calendarContainer = document.createElement('span');
        var $calendarContainer = $(calendarContainer);
        if ($this.attr('class') !== undefined) $calendarContainer.attr('class', $this.attr('class'));
        if ($this.attr('style') !== undefined) $calendarContainer.attr('style', $this.attr('style'));
        var calendarDiv = document.createElement('div');
        var $calendarDiv = $(calendarDiv);
        $calendarDiv.css({
          display: 'none',
          position: 'absolute'
        });
        var dateBtn = document.createElement('button');
        var $dateBtn = $(dateBtn);
        $dateBtn.addClass('datetime-local-datepicker-button');

        var timeField = document.createElement('input');
        var $timeField = $(timeField);
        $timeField.attr({
          type: "text",
          value: makeTimeDisplayString(value),
          size: 14
        });

        $this.replaceWith(hiddenField);
        $dateBtn.appendTo(calendarContainer);
        $calendarDiv.appendTo(calendarContainer);
        $calendarContainer.insertAfter(hiddenField);
        $timeField.insertAfter(calendarContainer);

        var halfHeight = ($timeField.outerHeight() / 2) + 'px';
        var upBtn = document.createElement('div');
        $(upBtn)
          .addClass('datetime-local-spin-btn datetime-local-spin-btn-up')
          .css('height', halfHeight);
        var downBtn = document.createElement('div');
        $(downBtn)
          .addClass('datetime-local-spin-btn datetime-local-spin-btn-down')
          .css('height', halfHeight);
        var btnContainer = document.createElement('div');
        btnContainer.appendChild(upBtn);
        btnContainer.appendChild(downBtn);
        $(btnContainer).addClass('datetime-local-spin-btn-container').insertAfter(timeField);

        $calendarDiv.datepicker({
          dateFormat: 'MM dd, yy',
          showButtonPanel: true
        });

        $dateBtn.text(makeDateDisplayString(value, calendarDiv));

        if (min !== undefined) $calendarDiv.datepicker("option", "minDate", min);
        if (max !== undefined) $calendarDiv.datepicker("option", "maxDate", max);
        var closeFunc;
        if (Modernizr.csstransitions) {
          calendarDiv.className = "datetime-local-calendar-dialog datetime-local-closed";
          $dateBtn.click(function () {
            $calendarDiv.unbind('transitionend oTransitionEnd webkitTransitionEnd MSTransitionEnd');
            calendarDiv.style.display = 'block';
            calendarDiv.className = "datetime-local-calendar-dialog datetime-local-open";
            return false;
          });
          closeFunc = function () {
            if (calendarDiv.className == "datetime-local-calendar-dialog datetime-local-open") {
              var transitionend_function = function(event, ui) {
                calendarDiv.style.display = 'none';
                $calendarDiv.unbind("transitionend oTransitionEnd webkitTransitionEnd MSTransitionEnd", transitionend_function);
              }
              $calendarDiv.bind("transitionend oTransitionEnd webkitTransitionEnd MSTransitionEnd", transitionend_function);
              calendarDiv.className = "datetime-local-calendar-dialog datetime-local-closed";
              return false;
            }
          }
        } else {
          $dateBtn.click(function(event) {
            event.preventDefault();
            $calendarDiv.fadeIn('fast');
          });
          closeFunc = function() {
            $calendarDiv.fadeOut('fast');
          }
        }
        $calendarDiv.mouseleave(closeFunc);
        $calendarDiv.datepicker( "option", "onSelect", function(dateText, inst) {
          var origDate = readDateTime($hiddenField.val());
          var dateObj = $.datepicker.parseDate('MM dd, yy', dateText);
          dateObj.setHours(origDate.getHours());
          dateObj.setMinutes(origDate.getMinutes());
          dateObj.setSeconds(origDate.getSeconds());
          dateObj.setMilliseconds(origDate.getMilliseconds());
          if (min !== undefined && dateObj < min) dateObj.setTime(min.getTime());
          else if (max !== undefined && dateObj > max) dateObj.setTime(max.getTime());
          dateObj = stepNormalize(dateObj, hiddenField);
          $hiddenField.val(makeDateTimeString(dateObj)).change();
          $timeField.val(makeTimeDisplayString(dateObj));
          $dateBtn.text(makeDateDisplayString(dateObj, calendarDiv));
          closeFunc();
        });
        $calendarDiv.datepicker("setDate", value);
        $dateBtn.bind({
          DOMMouseScroll: function(event) {
        	  if (event.detail < 0) incrementDate(hiddenField, dateBtn, timeField, calendarDiv);
        	  else decrementDate(hiddenField, dateBtn, timeField, calendarDiv);
        	  event.preventDefault();
          },
          mousewheel: function(event) {
        	  if (event.wheelDelta > 0) incrementDate(hiddenField, dateBtn, timeField, calendarDiv);
        	  else decrementDate(hiddenField, dateBtn, timeField, calendarDiv);
        	  event.preventDefault();
          },
          keypress: function(event) {
        	  if (event.keyCode == 38) { // up arrow
        	    incrementDate(hiddenField, dateBtn, timeField, calendarDiv);
        	    event.preventDefault();
        	  } else if (event.keyCode == 40) { // down arrow
        	    decrementDate(hiddenField, dateBtn, timeField, calendarDiv);
        	    event.preventDefault();
        	  }
          }
        });
        $timeField.bind({
          DOMMouseScroll: function(event) {
        	  if (event.detail < 0) increment(hiddenField, dateBtn, timeField, calendarDiv);
        	  else decrement(hiddenField, dateBtn, timeField, calendarDiv);
        	  event.preventDefault();
          },
          mousewheel: function(event) {
        	  if (event.wheelDelta > 0) increment(hiddenField, dateBtn, timeField, calendarDiv);
        	  else decrement(hiddenField, dateBtn, timeField, calendarDiv);
        	  event.preventDefault();
          },
          keypress: function(event) {
        	  if (event.keyCode == 38) // up arrow
        	    increment(hiddenField, dateBtn, timeField, calendarDiv);
        	  else if (event.keyCode == 40) // down arrow
        	    decrement(hiddenField, dateBtn, timeField, calendarDiv);
        	  else if ([35, 36, 37, 39, 46].indexOf(event.keyCode) == -1 && 
        		     [8, 9, 32, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 65, 77, 80, 97, 109, 112].indexOf(event.which) == -1)
        	    event.preventDefault();
          },
          change: function(event) {
            var $this = $(this);
            if (/^((?:1[0-2])|(?:0[1-9]))\:[0-5]\d(?:\:[0-5]\d(?:\.\d+)?)?\s[AaPp][Mm]$/.test($this.val())) {
              var matchData = /^(\d\d):(\d\d)(?:\:(\d\d)(?:\.(\d+))?)?\s([AaPp][Mm])$/.exec($this.val()),
                hours = parseInt(matchData[1], 10),
                minutes = parseInt(matchData[2], 10),
                seconds = parseInt(matchData[3], 10) || 0,
                milliseconds = matchData[4];
              if (milliseconds === undefined) milliseconds = 0;
              else if (milliseconds.length > 3) milliseconds = parseInt(milliseconds.substring(0, 3), 10);
              else if (milliseconds.length < 3) {
                while (milliseconds.length < 3) {
                  milliseconds += '0';
                }
                milliseconds = parseInt(milliseconds, 10);
              } else milliseconds = parseInt(milliseconds, 10);
              var ampm = matchData[5].toUpperCase(),
                dateObj = readDateTime($hiddenField.val());
              if ((ampm == 'AM') && (hours == 12)) hours = 0;
              else if ((ampm == 'PM') && (hours != 12)) hours += 12;
              dateObj.setHours(hours);
              dateObj.setMinutes(minutes);
              dateObj.setSeconds(seconds);
              dateObj.setMilliseconds(milliseconds);
              if (min !== undefined && dateObj < min) {
                $hiddenField.val(makeDateTimeString(min)).change();
                $this.val(makeTimeDisplayString(min));
              } else if (max !== undefined && dateObj > max) {
                $hiddenField.val(makeDateTimeString(max)).change();
                $this.val(makeTimeDisplayString(max));
              } else {
                dateObj = stepNormalize(dateObj, hiddenField);
                $hiddenField.val(makeDateTimeString(dateObj)).change();
                $this.val(makeTimeDisplayString(dateObj));
              }
            } else $this.val(makeTimeDisplayString(readDateTime($hiddenField.val())));
          }
        });
        $(upBtn).bind({
          mousedown: function (e) {
            increment(hiddenField, dateBtn, timeField, calendarDiv);

            var timeoutFunc = function (hiddenField, dateBtn, timeField, calendarDiv, incFunc) {
                incFunc(hiddenField, dateBtn, timeField, calendarDiv);

                timeField.timeoutID = window.setTimeout(timeoutFunc, 10, hiddenField, dateBtn, timeField, calendarDiv, incFunc);
              };

            var releaseFunc = function (e) {
                window.clearTimeout(timeField.timeoutID);
                $(document).unbind('mouseup', releaseFunc);
                $(upBtn).unbind('mouseleave', releaseFunc);
              };

            $(document).bind('mouseup', releaseFunc);
            $(upBtn).bind('mouseleave', releaseFunc);

            timeField.timeoutID = window.setTimeout(timeoutFunc, 700, hiddenField, dateBtn, timeField, calendarDiv, increment);
          }
        });
        $(downBtn).bind({
          mousedown: function (e) {
            decrement(hiddenField, dateBtn, timeField, calendarDiv);

            var timeoutFunc = function (hiddenField, dateBtn, timeField, calendarDiv, decFunc) {
                decFunc(hiddenField, dateBtn, timeField, calendarDiv);

                timeField.timeoutID = window.setTimeout(timeoutFunc, 10, hiddenField, dateBtn, timeField, calendarDiv, decFunc);
              };

            var releaseFunc = function (e) {
                window.clearTimeout(timeField.timeoutID);
                $(document).unbind('mouseup', releaseFunc);
                $(downBtn).unbind('mouseleave', releaseFunc);
              };

            $(document).bind('mouseup', releaseFunc);
            $(downBtn).bind('mouseleave', releaseFunc);

            timeField.timeoutID = window.setTimeout(timeoutFunc, 700, hiddenField, dateBtn, timeField, calendarDiv, decrement);
          }
        });
      });
    }
  });
})(jQuery);