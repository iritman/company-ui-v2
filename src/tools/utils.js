import jalaliMoment from "jalali-moment";
import persianJS from "persianjs";
import fileExtension from "file-extension";
import dayjs from "dayjs";
import passGenerator from "generate-password-browser";
// import passGenerator from "generate-password";
import Words from "../resources/words";

export function checkRegex(
  isFarsiChar,
  isEnglishLower,
  isEnglishUpper,
  isNumberic,
  specificChars,
  stingValueToCheck
) {
  const filter_FarsiChars = "اآبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیء";
  const filter_EnUpperChars = "A-Z";
  const filter_EnLowerChars = "a-z";
  const filter_NumericChars = "0-9";

  let pattern = "";
  if (isFarsiChar || isEnglishLower || isEnglishUpper || isNumberic) {
    if (isFarsiChar) {
      pattern += filter_FarsiChars;
    }
    if (isEnglishLower) {
      pattern += filter_EnLowerChars;
    }
    if (isEnglishUpper) {
      pattern += filter_EnUpperChars;
    }
    if (isNumberic) {
      pattern += filter_NumericChars;
    }
    if (specificChars.length > 0) {
      let chars = specificChars.split("");
      chars.forEach((ch) => {
        pattern += `\\${ch}`;
      });
      pattern += specificChars;
    }
    pattern = `^[${pattern}]+$`;
  }
  var patt = new RegExp(pattern);

  return patt.test(stingValueToCheck);
}

export function addFirstZero(txtNum) {
  if (typeof txtNum === "number") {
    if (txtNum < 10) {
      return `0${txtNum}`;
    } else {
      return txtNum;
    }
  } else if (typeof txtNum === "string") {
    if (txtNum.length < 2) {
      return `0${txtNum}`;
    } else {
      return txtNum;
    }
  } else return txtNum;
}

export function farsiNum(txt) {
  let originalText = `${txt}`;

  return originalText.length > 0
    ? persianJS(originalText).englishNumber().toString()
    : "";
}

export function reverseText(text) {
  return text.split("").reverse().join("");
}

export function moneyNumber(number) {
  if (number >= 0 && number < 1000) return number;

  let txt = reverseText(`${number}`);

  let result = "";
  let part1 = txt.substr(0, 3);
  let part2 = txt.substr(3);
  result += `${part1},`;

  while (part2.length > 3) {
    txt = part2;
    part1 = txt.substr(0, 3);
    part2 = txt.substr(3);
    result += `${part1},`;
  }

  result += `${part2}`;

  return reverseText(result);
}

export function truncateText(source, size) {
  return source.length > size ? source.slice(0, size - 1) + "…" : source;
}

export function stringToDate(date) {
  const year = parseInt(date.substr(0, 4));
  const month = parseInt(date.substr(4, 2));
  const day = parseInt(date.substr(6, 2));

  return {
    year,
    month,
    day,
  };
}

export function stringToTime(time) {
  const hours = parseInt(time.substr(0, 2));
  const minutes = parseInt(time.substr(3, 2));

  return {
    hours,
    minutes,
  };
}

export function stringToTimeWithoutColon(time) {
  const hours = parseInt(time.substr(0, 2));
  const minutes = parseInt(time.substr(2, 2));

  return {
    hours,
    minutes,
  };
}

export function weekDayName(dayID) {
  let result = "";

  switch (dayID) {
    case 1: {
      result = "شنبه";
      break;
    }
    case 2: {
      result = "یکشنبه";
      break;
    }
    case 3: {
      result = "دوشنبه";
      break;
    }
    case 4: {
      result = "سه شنبه";
      break;
    }
    case 5: {
      result = "چهارشنبه";
      break;
    }
    case 6: {
      result = "پنجشنبه";
      break;
    }
    case 7: {
      result = "جمعه";
      break;
    }
    default: {
      result = "";
      break;
    }
  }

  return result;
}

export function monthName(monthID) {
  let result = "";

  switch (monthID) {
    case 1: {
      result = "فروردین";
      break;
    }
    case 2: {
      result = "اردیبهشت";
      break;
    }
    case 3: {
      result = "خرداد";
      break;
    }
    case 4: {
      result = "تیر";
      break;
    }
    case 5: {
      result = "مرداد";
      break;
    }
    case 6: {
      result = "شهریور";
      break;
    }
    case 7: {
      result = "مهر";
      break;
    }
    case 8: {
      result = "آبان";
      break;
    }
    case 9: {
      result = "آذر";
      break;
    }
    case 10: {
      result = "دی";
      break;
    }
    case 11: {
      result = "بهمن";
      break;
    }
    case 12: {
      result = "اسفند";
      break;
    }
    default: {
      result = "";
      break;
    }
  }

  return result;
}

export function currentDate() {
  const pdate = jalaliMoment().locale("fa").format("dddd DD MMMM YYYY");

  return farsiNum(pdate);
}

export function currentMiladiDateWithSlash() {
  var today = new Date();
  var date =
    today.getFullYear() +
    "/" +
    addFirstZero(today.getMonth() + 1) +
    "/" +
    addFirstZero(today.getDate());

  return date;
}

export function currentMiladiDateWithoutSlash() {
  var today = new Date();
  var date =
    today.getFullYear() +
    addFirstZero(today.getMonth() + 1) +
    addFirstZero(today.getDate());

  return date;
}

export function currentPersianDateWithSlash() {
  var today = new Date();
  var date =
    today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();

  return jalaliMoment(date, "YYYY/MM/DD").locale("fa").format("YYYY/MM/DD");
}

export function currentPersianDateWithoutSlash() {
  var today = new Date();
  var date =
    today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();

  return jalaliMoment(date, "YYYY/MM/DD").locale("fa").format("YYYYMMDD");
}

export function currentDayName() {
  return jalaliMoment().add(1, "day").locale("fa").format("dddd");
}

export function nextDaysName(days) {
  return jalaliMoment().add(days, "day").locale("fa").format("dddd");
}

export function getPersianDate(addDays) {
  const currentDate = jalaliMoment()
    .add(addDays ? addDays : 0, "day")
    .locale("fa")
    .format("YYYY/M/D");

  const date_items = currentDate.split("/");

  return {
    year: parseInt(date_items[0]),
    month: parseInt(date_items[1]),
    day: parseInt(date_items[2]),
  };
}

export function nextDay(day) {
  const miladiDay = jalaliMoment
    .from(`${day.year}/${day.month}/${day.day}`, "fa", "YYYY/MM/DD")
    .format("YYYY/MM/DD");

  const persianDate = jalaliMoment(miladiDay, "YYYY/MM/DD")
    .add(1, "day")
    .locale("fa")
    .format("YYYY/M/D");

  const date_items = persianDate.split("/");

  return {
    year: parseInt(date_items[0]),
    month: parseInt(date_items[1]),
    day: parseInt(date_items[2]),
  };
}

export function dayName(day) {
  const miladiDay = jalaliMoment
    .from(`${day.year}/${day.month}/${day.day}`, "fa", "YYYY/MM/DD")
    .format("YYYY/MM/DD");

  return farsiNum(
    jalaliMoment(miladiDay, "YYYY/MM/DD")
      .locale("fa")
      .format("dddd DD MMMM YYYY")
  );
}

export function dayNameFromText(day) {
  const miladiDay = jalaliMoment
    .from(`${day}`, "fa", "YYYYMMDD")
    .format("YYYY/MM/DD");

  return farsiNum(
    jalaliMoment(miladiDay, "YYYY/MM/DD")
      .locale("fa")
      .format("dddd DD MMMM YYYY")
  );
}

export function weekDayNameFromDay(d) {
  const { year, month, day } = d;

  const date = `${year}${addFirstZero(month)}${addFirstZero(day)}`;

  const miladiDay = jalaliMoment
    .from(`${date}`, "fa", "YYYYMMDD")
    .format("YYYY/MM/DD");

  return farsiNum(
    jalaliMoment(miladiDay, "YYYY/MM/DD").locale("fa").format("dddd")
  );
}

export function weekDayNameFromText(day) {
  const miladiDay = jalaliMoment
    .from(`${day}`, "fa", "YYYYMMDD")
    .format("YYYY/MM/DD");

  return farsiNum(
    jalaliMoment(miladiDay, "YYYY/MM/DD").locale("fa").format("dddd")
  );
}

export function dateToText(date) {
  return `${date.year}${addFirstZero(`${date.month}`)}${addFirstZero(
    `${date.day}`
  )}`;
}

export function persianTime(time) {
  return farsiNum(`${addFirstZero(time.hours)}:${addFirstZero(time.minutes)}`);
}

export function formattedTime(time) {
  return `${addFirstZero(time.hours)}:${addFirstZero(time.minutes)}`;
}

export function formattedFullTime(date) {
  var d = date || new Date();
  var z = (n) => ("0" + n).slice(-2);
  var zz = (n) => ("00" + n).slice(-3);
  return `${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}.${zz(
    d.getMilliseconds()
  )}`;
}

export function formattedDate(date) {
  return `${addFirstZero(date.year)}/${addFirstZero(date.month)}/${addFirstZero(
    date.day
  )}`;
}

export function formattedDateWithoutSlash(date) {
  return `${addFirstZero(date.year)}${addFirstZero(date.month)}${addFirstZero(
    date.day
  )}`;
}

export function slashDate(dateTxt) {
  return dateTxt
    ? `${dateTxt.substr(0, 4)}/${dateTxt.substr(4, 2)}/${dateTxt.substr(6)}`
    : "//";
}

export function colonTime(timeTxt) {
  let result = "::";

  if (timeTxt) {
    result = `${timeTxt.substr(0, 2)}:${timeTxt.substr(2, 2)}`;

    if (timeTxt.length === 6) {
      result += `:${timeTxt.substr(4)}`;
    }
  }

  return result;
}

export function formattedDateTime(dateTxt, timeTxt) {
  return farsiNum(`${slashDate(dateTxt)} - ${colonTime(timeTxt)}`);
}

export function jalaliToMiladi(date, time) {
  const dateForamtted = `${date.substr(0, 4)}/${date.substr(
    4,
    2
  )}/${date.substr(6, 2)}`;
  const timeFormatted = `${time.substr(0, 2)}:${time.substr(2, 2)}`;

  const miladiDateTimeObject = jalaliMoment(
    `${dateForamtted} ${timeFormatted}`,
    "jYYYY/jM/jD HH:mm"
  ).toDate();

  return miladiDateTimeObject;
}

export function isImageFile(filename) {
  const ext = fileExtension(filename);

  const imageExtensioan = ["jpg", "jpeg", "png", "bmp"];

  return imageExtensioan.filter((fx) => fx === ext).length > 0;
}

export function jalaliDate(dashedDateString) {
  dayjs.calendar("jalali");

  return dayjs(dashedDateString, { jalali: true });
}

export function generateRandomNumericPassword(passLength) {
  return passGenerator.generate({
    length: passLength,
    numbers: true,
    lowercase: false,
    uppercase: false,
    symbols: false,
  });
}

export function checkNationalCode(nationalCode) {
  if (nationalCode.length === 10) {
    if (
      nationalCode === "0000000000" ||
      nationalCode === "1111111111" ||
      nationalCode === "2222222222" ||
      nationalCode === "3333333333" ||
      nationalCode === "4444444444" ||
      nationalCode === "5555555555" ||
      nationalCode === "6666666666" ||
      nationalCode === "7777777777" ||
      nationalCode === "8888888888" ||
      nationalCode === "9999999999"
    ) {
      return false;
    }

    const c = parseInt(nationalCode.charAt(9));

    const n =
      parseInt(nationalCode.charAt(0)) * 10 +
      parseInt(nationalCode.charAt(1)) * 9 +
      parseInt(nationalCode.charAt(2)) * 8 +
      parseInt(nationalCode.charAt(3)) * 7 +
      parseInt(nationalCode.charAt(4)) * 6 +
      parseInt(nationalCode.charAt(5)) * 5 +
      parseInt(nationalCode.charAt(6)) * 4 +
      parseInt(nationalCode.charAt(7)) * 3 +
      parseInt(nationalCode.charAt(8)) * 2;

    const r = n - parseInt(n / 11) * 11;

    if (
      (r === 0 && r === c) ||
      (r === 1 && c === 1) ||
      (r > 1 && c === 11 - r)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function minToTime(minutes) {
  let result = "";

  let hh = Math.trunc(minutes / 60);
  let mm = minutes % 60;

  result = `${addFirstZero(hh)}:${addFirstZero(mm)}`;

  return result;
}

export function getMonthList() {
  return [
    { monthID: 1 },
    { monthID: 2 },
    { monthID: 3 },
    { monthID: 4 },
    { monthID: 5 },
    { monthID: 6 },
    { monthID: 7 },
    { monthID: 8 },
    { monthID: 9 },
    { monthID: 10 },
    { monthID: 11 },
    { monthID: 12 },
  ];
}

export function textSeparator(text, len, separator) {
  let result = "";

  for (let index = 0; index < text.length; index++) {
    result = `${result}${text[index]}`;

    if ((index + 1) % len === 0 && index < text.length - 1) {
      result = result + separator;
    }
  }

  return result;
}

export function hasSelectedFilter(baseObject, checkObject) {
  let result = false;

  for (const key in checkObject) {
    if (checkObject[key] !== baseObject[key]) {
      result = true;
      break;
    }
  }

  return result;
}

export function getDescription(standard_details_text, details_text) {
  let result = `${standard_details_text} - ${details_text}`;

  if (result.startsWith(" - ")) result = result.substring(3);
  if (result.endsWith(" - ")) result = result.substring(0, result.length - 4);

  return result;
}

export function setDefaultCurrency(
  set_record,
  init_record,
  load_fields_value,
  form_ref,
  currencies
) {
  const rec = { ...init_record };
  const default_currency = currencies.find((c) => c.IsDefault === true);
  if (default_currency) {
    rec.CurrencyID = default_currency.CurrencyID;
  }

  set_record(rec);
  load_fields_value(form_ref, rec);
}

export function workTimeToText(obj) {
  const {
    days,
    // remain_mins,
    hours,
    minutes,
  } = obj;

  let part_1 = days > 0 ? `${days} ${Words.day}` : "";
  let part_2 = hours > 0 ? `${hours} ${Words.hour}` : "";
  let part_3 = minutes > 0 ? `${minutes} ${Words.minute}` : "";

  let result = [];
  if (part_1.length > 0) result = [...result, part_1];
  if (part_2.length > 0) result = [...result, part_2];
  if (part_3.length > 0) result = [...result, part_3];

  result = result.join(` ${Words.and} `);

  return result;
}

export function getWorkTimeInfo(data) {
  let daily = 0;

  let total_mins = 0;
  let days = 0;
  let hours = 0;
  let minutes = 0;

  data.forEach((r) => {
    if (r.StartTime.length === 0 && r.FinishTime.length === 0)
      daily += parseInt(r.WorkTimeInMin / 1440); // 1 day = 1,440 min

    total_mins += r.WorkTimeInMin;
  });

  days = daily;
  let remain_mins = parseInt(total_mins % 1440);
  hours = parseInt(remain_mins / 60);
  minutes = parseInt(remain_mins % 60);

  return {
    days,
    remain_mins,
    hours,
    minutes,
  };
}

export const VALID_REGEX =
  /^[آ-یa-zA-Z0-9،,:<>?-_=+()*&^%$#@!~{}؟۰-۹.\-()\s]+$/;

const methods = {
  VALID_REGEX,
  addFirstZero,
  farsiNum,
  reverseText,
  moneyNumber,
  stringToDate,
  stringToTime,
  stringToTimeWithoutColon,
  currentDate,
  currentPersianDateWithSlash,
  currentPersianDateWithoutSlash,
  currentMiladiDateWithSlash,
  currentMiladiDateWithoutSlash,
  currentDayName,
  nextDaysName,
  getPersianDate,
  nextDay,
  dayName,
  dayNameFromText,
  weekDayNameFromDay,
  weekDayNameFromText,
  dateToText,
  persianTime,
  formattedTime,
  formattedFullTime,
  formattedDate,
  formattedDateWithoutSlash,
  truncateText,
  checkRegex,
  slashDate,
  colonTime,
  formattedDateTime,
  weekDayName,
  monthName,
  jalaliToMiladi,
  isImageFile,
  jalaliDate,
  generateRandomNumericPassword,
  checkNationalCode,
  minToTime,
  getMonthList,
  textSeparator,
  hasSelectedFilter,
  getDescription,
  setDefaultCurrency,
  workTimeToText,
  getWorkTimeInfo,
};

export default methods;
