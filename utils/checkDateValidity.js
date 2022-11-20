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

const checkDateValidity = (date) => {
    const dateArr = date.split('-');
    const maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const days = parseInt(dateArr[0]);
    const months = parseInt(dateArr[1]);
    const years = parseInt(dateArr[2]);
    if(years < 0) {
        return false;
    }
    if(months <= 0 || months >= 13) {
        return false;
    }
    if(isLeapYear(years) && months === 2) {
        if(days > 0 && days < 30) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if(days > 0 && days <= maxDaysInMonth[months - 1]) {
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = checkDateValidity;
