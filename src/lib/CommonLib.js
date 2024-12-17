const monthArrayObject = [
    {
        month: 0,
        short_name: "Jan",
        full_name: "January"
    },
    {
        month: 1,
        short_name: "Feb",
        full_name: "February"
    },
    {
        month: 2,
        short_name: "Mar",
        full_name: "March"
    },
    {
        month: 3,
        short_name: "Apr",
        full_name: "April"
    },
    {
        month: 4,
        short_name: "May",
        full_name: "May"
    },
    {
        month: 5,
        short_name: "Jun",
        full_name: "June"
    },
    {
        month: 6,
        short_name: "Jul",
        full_name: "July"
    },
    {
        month: 7,
        short_name: "Aug",
        full_name: "August"
    },
    {
        month: 8,
        short_name: "Sep",
        full_name: "September"
    },
    {
        month: 9,
        short_name: "Oct",
        full_name: "October"
    },
    {
        month: 10,
        short_name: "Nov",
        full_name: "November"
    },
    {
        month: 11,
        short_name: "Dec",
        full_name: "December"
    },
]

export const CommonLib = {
    // Date handlers
    /**
     * Only handle string with this kind of format: 202401 => YYYYMM
     */
    getOnlyMonthAndYearForDeckCatalogueEdition(dateString) {
        const dateStringLength = dateString.length;
        const month =  dateString[dateStringLength - 2] + "" + dateString[dateStringLength - 1]; // Get last to digit of the string. Example: 202401 => return 01
        let year = "";
        for (let i = 0; i < dateStringLength - 2; i++) {
            year += dateString[i];
        }
        const monthDataObj = monthArrayObject[parseInt(month) - 1];
        if (monthDataObj) {
            const dateValue = new Date();
            dateValue.setMonth(monthDataObj.month);
            dateValue.setFullYear(year);
            dateValue.setDate(15);
            return {
                date_string: `${monthDataObj.short_name}/${year}`,
                date_value: dateValue
            }; 
        }
        return "";
    },
};