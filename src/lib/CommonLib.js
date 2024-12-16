const monthShortNameArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const monthFullNameArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const CommonLib = {
    // Date handlers
    /**
     * date: Transfer the date you want to get only month and year for the first param ||
     * monthPosition: the position of month in the string date ||
     * yearPosition: the position of the year in the string date ||
     * separator: which is - or / used in a date string, Exp: 01/01/0001 => / is the separator of this string ||
     * keepSeparator: if you want to keep separator in the result string of this function just transfer true to this function. Results can be like this: Jan/2024 and with false value it will be like this: Jan 2024
     */
    getOnlyMonthAndYearForShortDate(date, monthPosition, yearPosition, separator, keepSeparator = false) {
        const splittedDate = date.split(separator);
        if (keepSeparator) {
            return `${monthShortNameArray[parseInt(splittedDate[monthPosition]) - 1]}${separator}${splittedDate[yearPosition]}`;
        }
        return `${monthShortNameArray[parseInt(splittedDate[monthPosition]) - 1]} ${splittedDate[yearPosition]}`;
    },
};