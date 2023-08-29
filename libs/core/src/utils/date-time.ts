import { DateTime as LDateTime } from 'luxon';

interface Duration {
  years?: number;
  months?: number;
  days?: number;
  milliseconds?: number;
}

interface TimeUnits {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}

export class DateTime {
  private readonly date: LDateTime;

  public constructor(date: LDateTime) {
    if (!date.isValid) {
      throw new Error(date.invalidExplanation ?? 'invalid date');
    }

    this.date = date;
  }

  static parse(date: string): DateTime {
    return new this(LDateTime.fromISO(date, { zone: 'UTC' }));
  }

  static parseFromLDateTime(date: LDateTime): DateTime {
    return new this(date.toUTC());
  }

  static parseFromJSDate(date: Date): DateTime {
    return new this(LDateTime.fromJSDate(date));
  }

  getDate(): LDateTime {
    return this.date.toUTC(); // always UTC
  }

  /**
   * Get the day of the week. 1 is Monday and 7 is Sunday (ISO week date)
   */
  getWeekDay(): number {
    return this.getDate().weekday;
  }

  getTimeUnits(): TimeUnits {
    const date = this.getDate();

    return {
      hour: date.hour,
      minute: date.minute,
      second: date.second,
      millisecond: date.millisecond,
    };
  }

  isSameOrBefore(date: DateTime): boolean {
    return (
      this.getDate().diff(date.getDate(), 'milliseconds').milliseconds <= 0
    );
  }

  plus(duration: Duration): DateTime {
    return new DateTime(this.getDate().plus(duration));
  }

  set(values: TimeUnits) {
    return new DateTime(this.getDate().set(values));
  }

  toJSDate(): Date {
    return this.getDate().toJSDate();
  }

  toISO8601String() {
    return this.getDate().toUTC().toISO();
  }
}
