import RelativeTimeFormat from "relative-time-format"
import en from "relative-time-format/locale/en"

RelativeTimeFormat.addLocale(en)

export function timeSince(date) {
    try {
        var timeStamp = date.getTime();
        var now = new Date(),
            secondsPast = (now.getTime() - timeStamp) / 1000;
        if (secondsPast < 60) {
            return parseInt(secondsPast) + 's ago';
        }
        if (secondsPast < 3600) {
            return parseInt(secondsPast / 60) + 'm ago';
        }
        if (secondsPast <= 86400) {
            return parseInt(secondsPast / 3600) + 'h ago';
        }

        if (secondsPast > 86400) {
            const day = date.getDate();
            const month = date.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
            const year = date.getFullYear() == date.getFullYear() ? "" : " " + date.getFullYear();
            return day + " " + month + year;
        }
    } catch (e) {
        console.log("Error in timeSince: ", e);
        return "unknown";
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
