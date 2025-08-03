import dayjs from 'dayjs';

export class DayjsDateProvider {
  compareInSeconds(startDate: Date | string, endDate: Date | string): number {
    return dayjs(startDate).diff(endDate, 'seconds');
  }

  compareInHours(startDate: Date | string, endDate: Date | string): number {
    return dayjs(startDate).diff(endDate, 'hours');
  }

  dateNow(): Date {
    return dayjs().toDate();
  }

  compareInDays(startDate: Date | string, endDate: Date | string): number {
    return dayjs(startDate).diff(endDate, 'days');
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, 'hour').toDate();
  }

  compareIfBefore(startDate: Date | string, endDate: Date | string): boolean {
    return dayjs(startDate).isBefore(endDate);
  }

  compareIfAfter(startDate: Date | string, endDate: Date | string): boolean {
    return dayjs(startDate).isAfter(endDate);
  }
}
