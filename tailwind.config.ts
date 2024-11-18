import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
	container:{
		center: true,
		padding: "2rem",
		screens:{
			"2xl" : "1400px",
		},
	},
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			mycolor1 : '#f4f4f4',
			mycolor2 : '#201f1f',
			mycolor3 : '#e21818',
			mycolor4 : '#00235b',
			mycolor5 : '#ffdd83',
			mycolor6 : '#98dfd6',
			mycolor7 : '#555555',
			mycolor8 : '#FFFFFF'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  }
};
export default config;
