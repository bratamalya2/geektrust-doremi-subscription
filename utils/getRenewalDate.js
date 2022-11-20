const isLeapYear = (year) => {
    if(year % 4 !== 0) {
        return false;
    }
    else if(year % 100 === 0 && year % 400 !== 0) {
        return false;
    }
    else {
        return true
    }
}

const getRenewalDate = (currentDate, duration) => {
    const dateArr = currentDate.split('-');
    const daysInMonthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let days = parseInt(dateArr[0]), months = parseInt(dateArr[1]), years = parseInt(dateArr[2]);
    if(months + duration > 12) {
        years++;
    }
    months = (months + duration) % 12;
    days = days - 10;
    if(days <= 0) {
        months--;
        days = daysInMonthArr[months-1] + days;
    }
    if(months <= 0) {
        months = months + 12;
        years--;
    }
    days = days<10?`0${days}`:`${days}`;
    months = months<10?`0${months}`:`${months}`;
    return `${days}-${months}-${years}`;
}

module.exports = getRenewalDate;