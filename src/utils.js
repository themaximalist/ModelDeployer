import RelativeTimeFormat from "relative-time-format"
import en from "relative-time-format/locale/en"

RelativeTimeFormat.addLocale(en)

export function timeSince(date) {
    var timeStamp = date.getTime();
    var now = new Date(),
        secondsPast = (now.getTime() - timeStamp) / 1000;
    if (secondsPast < 60) {
        return parseInt(secondsPast) + 's';
    }
    if (secondsPast < 3600) {
        return parseInt(secondsPast / 60) + 'm';
    }
    if (secondsPast <= 86400) {
        return parseInt(secondsPast / 3600) + 'h';
    }
    if (secondsPast > 86400) {
        day = timeStamp.getDate();
        month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
        return day + " " + month + year;
    }
}

export function smartRound(number) {
    let epsilon = 1e-14; // Threshold for floating point arithmetic precision
    let multiplier = 1;
    let roundedNumber = number;

    while (Math.round(roundedNumber * multiplier) / multiplier !== number) {
        multiplier *= 10;
        roundedNumber = Math.round(number * multiplier) / multiplier;

        // Break if the difference is within floating point precision limits
        if (Math.abs(roundedNumber - number) < epsilon) {
            break;
        }
    }

    return roundedNumber;
}