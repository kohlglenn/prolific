export const getDate = () => {
    return dateToYyyymmdd(new Date(Date.now()));
};

export const dateToYyyymmdd = d => {
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = month < 10 ? "0" + month.toString() : month.toString();
    let day = d.getDate();
    day = day < 10 ? "0" + day.toString() : day.toString();
    return `${year}-${month}-${day}`;
}

// REQUIRES: date to be in yyyy-mm-dd format only. returns at 8am that day
export const yyyymmddToDate = s => {
    return new Date(`${s}T08:00:00`);
};
