const withMT = require("@material-tailwind/react/utils/withMT");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
const theme = {
    content: [ "./src/**/*.{js,jsx,ts,tsx}" ],
    theme: {
        extend: {
            screens: {
                "3xl": "1920px"
            },
            keyframes: {
                "fade-in": {
                    "0%": { "opacity": "0%" },
                    "100%": { "opacity": "100%" }
                },
                "notification-sweep-in": {
                    "0%": { "transform": "translateX(300%)" },
                    "100%": { "transform": "translateX(0)" }
                }
            },
            animation: {
                "fade-in": "fade-in 500ms 1",
                "notification-sweep-in": "notification-sweep-in 300ms 1"
            }
        },
        fontFamily: {
            "sans": [ "Inter", ...defaultTheme.fontFamily.sans ],
            "serif": [ "IBM Plex Serif", ...defaultTheme.fontFamily.serif ],
            "display": [ "Rubik", ...defaultTheme.fontFamily.sans ],
            "body": [ ...defaultTheme.fontFamily.serif ],
            "mono": [ ...defaultTheme.fontFamily.mono ]
        }
    },
    plugins: []
};

module.exports = withMT(theme);

