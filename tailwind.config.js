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
            }
        },
    },
    plugins: [
        import("@tailwindcss/forms"),
        import("@tailwindcss/typography")
    ]
}

