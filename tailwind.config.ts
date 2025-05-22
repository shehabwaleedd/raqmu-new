import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'helvetica': ['Helvetica', 'Helvetica Neue', 'Arial', 'sans-serif'],
                'sans': ['Helvetica', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            colors: {
                gray: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d0d0d0',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
                black: '#000000',
                white: '#ffffff',
            },
            zIndex: {
                '40': '40',
                '50': '50',
                '98': '98',
                '99': '99',
            },
            borderWidth: {
                '0': '0px',
                '1': '1px',
                '2': '2px',
                '4': '4px',
                '8': '8px',
            },
            spacing: {
                '18': '4.5rem',
                '72': '18rem',
                '80': '20rem',
                '96': '24rem',
            },
        },
    },
    plugins: [
        function ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
            const newUtilities = {
                '.font-helvetica': {
                    fontFamily: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
                },
                '.border-2px': {
                    borderWidth: '2px',
                },
                '.border-t-2px': {
                    borderTopWidth: '2px',
                },
                '.border-b-2px': {
                    borderBottomWidth: '2px',
                },
                '.border-l-2px': {
                    borderLeftWidth: '2px',
                },
                '.border-r-2px': {
                    borderRightWidth: '2px',
                },
            }
            addUtilities(newUtilities)
        }
    ],
}

export default config