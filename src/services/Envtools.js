export default class Envtools {
    static toJSON(envString) {
        if (!envString) {
            return {};
        }

        const lines = envString.split('\n');
        let result = {};

        lines.forEach(function (line) {
            const parts = line.split('=');
            if (parts.length === 2) {
                const key = parts[0].trim();
                const value = parts[1].trim();
                if (key.length > 0 && value.length > 0) {
                    result[key] = value;
                }
            }
        });

        return result;
    }

    static fromJSON(jsonObject) {
        if (Object.keys(jsonObject).length === 0) {
            return "";
        }

        let envString = "";

        for (const [key, value] of Object.entries(jsonObject)) {
            envString += `${key}=${value}\n`;
        }

        // Remove the last new line character for cleaner output
        envString = envString.trim();

        return envString;
    }

    static toEnv(json) {
        if (!json) { return "" }
        if (typeof json === "string") { return json }
        if (typeof json !== "object") { return "" }
        return this.fromJSON(json);
    }

}