export const getDate = () => {
    return dateToYyyymmdd(new Date(Date.now()));
};

export const dateToHhmm = d => {
    let h = d.getHours();
    h = addZero(h);
    const m = addZero(d.getMinutes());
    return `${h}:${m}`;
};

export const dateToYyyymmdd = d => {
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = month < 10 ? "0" + month.toString() : month.toString();
    let day = d.getDate();
    day = day < 10 ? "0" + day.toString() : day.toString();
    return `${year}-${month}-${day}`;
};

// REQUIRES: date to be in yyyy-mm-dd format only. returns at 8am that day
export const yyyymmddToDate = s => {
    return new Date(`${s}T08:00:00`);
};

// REQUIRES: ds to be 'yyyy-mm-dd' and hs to be 'hh:mm' formats exactly.
// converts a date and a time into date-time form and creates a new date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
export const yyyymmddhhmmToDate = (ds, hs) => {
    return new Date(`${ds}T${hs}:00`);
};

export const fullDateStringToYyyymmdd = s => {
    const date = new Date(s);
    return dateToYyyymmdd(date);
};

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
};

export const fullDateStringToHourMinPm = s => {
    const date = new Date(s);
    let h = date.getHours();
    const ampm = h >= 12 ? "pm" : "am";
    h = h >= 12 ? h - 12: h;
    h = addZero(h);
    const m = addZero(date.getMinutes());
    return `${h}:${m} ${ampm}`;
}
