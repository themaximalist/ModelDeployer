/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js}",
        "./views/**/*.{html,ejs}"
    ],
    theme: {
        extend: {
            screens: {
                '3xl': '1700px',
            },
            colors: {
                "mod-purple": "#4D3DA9",
                "mod-dark-blue": "#22337B",
                "mod-blue": "#104799",
                "mod-light-blue": "#3983D9",
                "mod-red": "#F92D2D",
                "mod-orange": "#E4741B",
                "mod-pink": "#BB5F9F",
                "mod-yellow": "#F3AD45",
                "mod-turquoise": "#AEDFEB",
                "mod-baby-blue": "#C7D8F5",
                "mod-light-purple": "#D4C7D0",
                "mod-mustard": "#E7C69F",
                "mod-black": "#0C1727",
                "mod-darkest-gray": "#27313F",
                "mod-dark-gray": "#424A57",
                "mod-gray": "#586374",
                "mod-light-gray": "#9197A1",
                "mod-lighter-gray": "#B0B2B5",
                "mod-very-light-gray": "#CACCCE",
                "mod-lightest-gray": "#E5E5E6",
                "mod-white": "#FAFAFA",

            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography")
    ]
}

