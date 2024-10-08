import { v4 as uuidv4 } from 'uuid';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  ClientSession,
} from 'mongoose';
import { DateTime } from 'luxon';

@Injectable()
export class BaseService<C extends Document, PType> {
  constructor(private readonly model: Model<C>) {}

  abortSessionIfActive(session: ClientSession) {
    if (session.transaction.isActive) return session.abortTransaction();
  }
  /** always round up to the nearest 10 if not specified */
  roundUpValue(value: number, nearest = 10) {
    return Math.round(value * nearest) / nearest;
  }
  generateUUID() {
    return uuidv4();
  }
  convertDateToUTC(d: Date) {
    const date = new Date(d);
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }
  convertDateTimeToUTC(d: Date) {
    const date = new Date(d);
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds(),
      ),
    );
  }

  dateFormatter(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      weekday: 'short',
      year: 'numeric',
    });
  }

  dateDifferenceInDays(date1: Date, date2: Date) {
    const diff = date2.getTime() - date1.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  dateDifferenceInHours(date1: Date, date2: Date) {
    const diff = date2.getTime() - date1.getTime();
    return Math.round(diff / (1000 * 3600)).toFixed(2) as unknown as number;
  }

  async getSession() {
    return this.model.startSession();
  }

  async findByIdAndUpdateWithSession(
    id: string,
    data: UpdateQuery<C>,
    session: ClientSession,
  ) {
    try {
      const result = await this.model.findByIdAndUpdate(id, data, {
        new: true,
        session,
      });
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async distinct(filter: FilterQuery<C>, field: keyof C) {
    return await this.model.distinct(field as unknown as string, filter);
  }

  async createDocuments(document: Partial<C>) {
    return await this.model.create({ ...document });
  }

  async countDocuments(filter?: FilterQuery<C>) {
    return this.model.countDocuments(filter);
  }
  async insertManyWithSession(model: C[], session: ClientSession) {
    return await this.model.insertMany(model, {
      session,
    });
  }
  async insertMany(model: C[]) {
    return await this.model.insertMany(model, {});
  }
  async findOneAndUpdateOrErrorOut(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    population?: Array<PType> | any,
  ) {
    try {
      const result = await this.model
        .findOneAndUpdate(filter, data, {
          new: true,
        })
        .populate(population);
      if (!result)
        throw new BadRequestException(`${this.model.modelName} not found`);

      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  async findByIdAndUpdateOrErrorOut(
    id: string,
    data: UpdateQuery<C>,
    population?: Array<PType> | any,
  ) {
    try {
      const result = await this.model
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .populate(population);
      if (!result)
        throw new BadRequestException(`${this.model.modelName} not found`);
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOneAndUpdateWithSession(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    session: ClientSession,
  ) {
    try {
      const result = await this.model.findOneAndUpdate(filter, data, {
        new: true,
        session,
      });
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  async updateManyWithSession(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    session: ClientSession,
  ) {
    try {
      const result = await this.model.updateMany(filter, data, {
        session,
        new: true,
      });
      return result;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async findOneAndDelete(filter: FilterQuery<C>){
    return await this.model.findOneAndDelete(filter);
  }

  async deleteByIdOrErrorOut(id: string) {
    try {
      await this.model.findByIdAndDelete(id);
    } catch (e) {
      throw new NotFoundException(`error deleting ${this.model.modelName}`);
    }
  }
  async deleteManyWithSession(filter: FilterQuery<C>, session: ClientSession) {
    const deletedRecrods = await this.model.deleteMany(filter, { session });
    if (!deletedRecrods)
      throw new NotFoundException(
        `error deleting ${this.model.modelName} records`,
      );
    return deletedRecrods;
  }

  async deleteMany(filter: FilterQuery<C>) {
    const deletedRecrods = await this.model.deleteMany(filter);
    if (!deletedRecrods)
      throw new NotFoundException(
        `error deleting ${this.model.modelName} records`,
      );
    return deletedRecrods;
  }
  async findById(id: string, population?: Array<PType> | any) {
    return this.model.findById(id).populate(population);
  }
  async findByIdOrErrorOut(id: string, population?: Array<PType> | any) {
    const found = await this.model.findById(id).populate(population);
    if (!found)
      throw new NotFoundException(`${this.model.modelName} not found`);
    return found;
  }
  async findByIdAndUpdate(
    id: string,
    data: UpdateQuery<C>,
    population?: Array<PType> | any,
  ) {
    try {
      const foundRecord = await this.model
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .populate(population);
      return foundRecord;
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException(e.message);
    }
  }
  async updateOneOrErrorOut(filter: FilterQuery<C>, data: UpdateQuery<C>) {
    try {
      return await this.model.updateOne(filter, data, { new: true });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async updateMany(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    population?: Array<PType> | any,
  ) {
    try {
      const foundRecord = await this.model
        .updateMany(filter, data, {
          new: true,
        })
        .populate(population);
      return foundRecord;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async updateManyOrErrorOut(
    filter: FilterQuery<C>,
    data: UpdateQuery<C>,
    population?: Array<PType> | any,
  ) {
    try {
      const response = await this.model
        .updateMany(filter, data, {
          new: true,
        })
        .populate(population);
      if (!response)
        throw new BadRequestException(
          `error updating ${this.model.modelName} `,
        );
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async updateByIdErrorOut(
    id: string,
    data: UpdateQuery<C>,
    population?: Array<PType> | any,
  ) {
    try {
      const foundRecord = await this.model
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .populate(population);
      if (!foundRecord)
        throw new NotFoundException(
          `${this.model.modelName}  record not found`,
        );
      return foundRecord;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  findOne(data: FilterQuery<C>, populate?: Array<PType> | any) {
    return this.model.findOne(data).populate(populate);
  }
  find(data: FilterQuery<C>, populate?: Array<PType> | any) {
    return this.model.find(data).populate(populate);
  }

  aggregate(aggregationQuery) {
    return this.model.aggregate(aggregationQuery);
  }

  async findOrErrorOut(data: FilterQuery<C>, populate?: Array<PType> | any) {
    const results = await this.model.find(data).populate(populate);
    if (!results.length)
      throw new NotFoundException(`${this.model.modelName} records not found`);

    return results;
  }
  async findOneOrErrorOut(
    data: FilterQuery<C>,
    populate?: Array<PType> | any,
    error?: HttpException,
  ) {
    const foundRecord = await this.findOne(data).populate(populate);

    if (!foundRecord)
      throw (
        error ??
        new NotFoundException(`${this.model.modelName} record not found`)
      );

    return foundRecord;
  }
  async propExists(data: FilterQuery<C>) {
    return this.model.countDocuments(data).then((count) => count > 0);
  }
  // Date of Birth Handler (D, M, Y)
  convertDOB(date: Date) {
    const dateObj = date;
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    return {
      day,
      month,
      year,
    };
  }

  getDatesInBetween(startDate: Date, stopDate: Date) {
    const dateArray = [];
    let currentDate = startDate;
    const addDays = function (days) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    while (currentDate <= stopDate) {
      dateArray.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dateArray;
  }

  getTheNumberOfMonthsBetweenDates(dateOne: Date, dateTwo: Date) {
    dateOne = new Date(dateOne);
    dateTwo = new Date(dateTwo);
    const dateOneDatetime = DateTime.fromJSDate(dateOne).toUTC();
    const dateTwoDatetime = DateTime.fromJSDate(dateTwo).toUTC();
    const { months } = dateTwoDatetime.diff(dateOneDatetime, 'months');
    Logger.debug(`number of months between dates is: ${months}`);
    return months;
  }

  getTheFirstDayOfTheWeekWithinADateRange(startDate: Date, endDate: Date) {
    const aDay = 7 * 24 * 60 * 60 * 1000;
    let firstDay = startDate.getTime();
    const firstDayOfTheWeekArray = [];
    while (firstDay <= endDate.getTime()) {
      firstDayOfTheWeekArray.push(new Date(firstDay).toUTCString());
      firstDay += aDay;
    }
    return firstDayOfTheWeekArray;
  }

  getTheFirstDayOfTheMonthWithinADateRange(startDate: Date, endDate: Date) {
    //Get the first day for the end date for the month
    const newEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    //get the date counter to start from the middle of the month
    const counter = new Date(startDate.getFullYear(), startDate.getMonth(), 15);
    const aMonth = 30 * 24 * 60 * 60 * 1000;
    let startCounter = counter.getTime();
    const firstDayOfTheMonthArray = [];
    while (startCounter <= newEndDate.getTime()) {
      let firstDayOfTheMonth = new Date(startCounter);
      firstDayOfTheMonth = new Date(
        firstDayOfTheMonth.getFullYear(),
        firstDayOfTheMonth.getMonth(),
        1,
      );

      firstDayOfTheMonthArray.push(firstDayOfTheMonth);
      startCounter += aMonth;
    }
    return firstDayOfTheMonthArray;
  }

  getDateFromWeekNumber(week: number) {
    const year = new Date().getFullYear();
    const day = 1 + (week - 1) * 7; // 1st of January + 7 days for each week
    return new Date(year, 0, day);
  }

  calculateTheStartDate(currentDate: Date) {
    let startDate = new Date(currentDate.getTime() - 35 * 24 * 60 * 60 * 1000);
    startDate = this.getTheStartDateForTheWeek(startDate);
    return startDate;
  }

  getTheStartDate(currentDate: Date) {
    //add a week to the current date and ge the start date for that week
    let startDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    startDate = this.getTheStartDateForTheWeek(startDate);
    return startDate;
  }

  getTheStartDateForTheWeek(currentDate: Date) {
    const firstDay = currentDate.getDate() - currentDate.getDay(); // First day is the day of the month - the day of the week
    const firstDayOfTheWeek = new Date(currentDate.setDate(firstDay));
    return firstDayOfTheWeek;
  }

  getTheFirstDayOfTheMonthWithValueWithinADateRange(
    startDate: Date,
    endDate: Date,
  ) {
    const startDateFullYear = new Date(startDate).getFullYear();
    const startDateMonth = new Date(startDate).getMonth() + 1;
    const startDateString = `${startDateFullYear}-${startDateMonth}-01`;

    const endDateFullYear = new Date(endDate).getFullYear();
    const endDatePreviousMonth = new Date(endDate).getMonth();
    const endDateString = `${endDateFullYear}-${endDatePreviousMonth}-01`;
    const dates = this.dateRange(startDateString, endDateString);
    return dates;
  }

  dateRange(startDate, endDate) {
    const start = startDate.split('-');
    const end = endDate.split('-');
    const startYear = parseInt(start[0]);
    const endYear = parseInt(end[0]);
    const dates = [];

    for (let i = startYear; i <= endYear; i++) {
      const endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
      const startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
      for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        const month = j + 1;
        const displayMonth = month < 10 ? '0' + month : month;
        dates.push([i, displayMonth, '01'].join('-'));
      }
    }
    return dates;
  }

  /** compare equality of two objects */
  compareObjectEquality(
    obj1: Record<string, unknown>,
    obj2: Record<string, unknown>,
  ) {
    const objectOfSameLength =
      Object.keys(obj1).length !== Object.keys(obj2).length;
    if (objectOfSameLength) return false;
    else {
      for (const key of Object.keys(obj1)) {
        if (obj1[key] !== obj2[key]) return false;
      }
      return true;
    }
  }
}
