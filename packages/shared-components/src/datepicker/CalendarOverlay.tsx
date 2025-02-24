import React, { Component } from 'react';
import moment from 'moment';
import DayPicker, { Modifier } from 'react-day-picker';

import {
  createIntl, DDMMYYYY_DATE_FORMAT, getRelatedTargetIE11, isIE11,
} from '@fpsak-frontend/utils';

import messages from '../../i18n/nb_NO.json';

const intl = createIntl(messages);

const getRelatedTarget = (e: React.FocusEvent): Promise<any> => {
  if (isIE11()) {
    return getRelatedTargetIE11();
  }
  return Promise.resolve(e.relatedTarget);
};

interface OwnProps {
  onDayChange: (selectedDay: Date) => void;
  className?: string;
  dayPickerClassName?: string;
  elementIsCalendarButton: (target: EventTarget) => boolean;
  value?: string;
  disabled?: boolean;
  onClose?: () => void;
  initialMonth?: Date;
  numberOfMonths?: number;
  disabledDays?: Modifier | Modifier[];
}

class CalendarOverlay extends Component<OwnProps> {
  static defaultProps = {
    value: '',
    disabled: false,
    onClose: () => undefined,
    initialMonth: null,
  };

  calendarRootRef: HTMLDivElement | undefined;

  constructor(props: OwnProps) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setCalendarRootRef = this.setCalendarRootRef.bind(this);
    this.parseDateValue = this.parseDateValue.bind(this);
    this.targetIsCalendarOrCalendarButton = this.targetIsCalendarOrCalendarButton.bind(this);
  }

  onBlur(e: React.FocusEvent): void {
    const { targetIsCalendarOrCalendarButton, props: { onClose } } = this;
    getRelatedTarget(e)
      .then((relatedTarget: HTMLDivElement) => {
        if (targetIsCalendarOrCalendarButton(relatedTarget)) {
          return;
        }
        if (onClose) {
          onClose();
        }
      });
  }

  onKeyDown({ key }: React.KeyboardEvent): void {
    if (key === 'Escape') {
      const { onClose } = this.props;
      if (onClose) {
        onClose();
      }
    }
  }

  setCalendarRootRef(calendarRootRef: HTMLDivElement): void {
    if (calendarRootRef) {
      this.calendarRootRef = calendarRootRef;
      calendarRootRef.focus();
    }
  }

  parseDateValue(): Date | undefined {
    const { value } = this.props;
    const parsedValue = moment(value, DDMMYYYY_DATE_FORMAT, true);
    if (parsedValue.isValid()) {
      return parsedValue.toDate();
    }
    return undefined;
  }

  targetIsCalendarOrCalendarButton(target: HTMLDivElement): boolean {
    const { calendarRootRef, props: { elementIsCalendarButton } } = this;

    const targetIsInsideCalendar = calendarRootRef && calendarRootRef.contains(target);
    const targetIsCalendarButton = elementIsCalendarButton(target);

    return targetIsInsideCalendar || targetIsCalendarButton;
  }

  render() {
    const { disabled } = this.props;
    if (disabled) {
      return null;
    }

    const { formatMessage, locale } = intl;
    const dayPickerLocalization = {
      locale,
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthNum) => formatMessage({ id: `Calendar.Month.${monthNum}` })),
      weekdaysLong: [0, 1, 2, 3, 4, 5, 6].map((dayNum) => formatMessage({ id: `Calendar.Day.${dayNum}` })),
      weekdaysShort: [0, 1, 2, 3, 4, 5, 6].map((dayName) => formatMessage({ id: `Calendar.Day.Short.${dayName}` })),
      firstDayOfWeek: 1,
    };

    const {
      onDayChange, className, dayPickerClassName, initialMonth, numberOfMonths, disabledDays,
    } = this.props;
    const selectedDay = this.parseDateValue();
    return (
      <div
        className={className}
        ref={this.setCalendarRootRef}
        onBlur={this.onBlur}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
        onKeyDown={this.onKeyDown}
        role="link"
      >
        <DayPicker
          {...dayPickerLocalization}
          className={dayPickerClassName}
          month={selectedDay}
          selectedDays={selectedDay}
          onDayClick={onDayChange}
          onKeyDown={this.onKeyDown}
          initialMonth={initialMonth}
          disabledDays={disabledDays}
          numberOfMonths={numberOfMonths}
        />
      </div>
    );
  }
}

export default CalendarOverlay;
