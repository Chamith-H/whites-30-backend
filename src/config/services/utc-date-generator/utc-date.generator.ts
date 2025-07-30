import * as moment from 'moment';

export class UtcDateGenerator {
  //!--> Convert date text to UTC
  async convert_singleDate(dateText: string): Promise<Date> {
    const dateUtc = await moment.utc(dateText).toDate();
    return dateUtc;
  }

  //!--> Get today, current date
  async getTodayDate() {
    const dateToday = new Date();
    const dateString = dateToday.toISOString();
    const dateUtc = await this.convert_singleDate(dateString);
    return dateUtc;
  }

  //!--> Get month, date, year
  async getMonthDateYear(date: Date) {
    const formattedDate = await moment(date);
    return {
      year: formattedDate.year(),
      month: formattedDate.month() + 1,
      day: formattedDate.date(),
    };
  }
}
