import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ['SweetLeaf', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      heading: ['SweetLeaf', 'ui-sans-serif', 'system-ui'],
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // Pokemon Pokedex Theme Colors
        hemp: {
          DEFAULT: "#2D5016",
          50: "#7DAA5C",
          100: "#719E50",
          200: "#5A8539",
          300: "#446D22",
          400: "#38591C",
          500: "#2D5016",
          600: "#224010",
          700: "#172F0A",
          800: "#0C1F05",
          900: "#010F00",
        },
        teal: {
          DEFAULT: "#00D4FF",
          50: "#B3F1FF",
          100: "#9EEDFF",
          200: "#75E6FF",
          300: "#4DDEFF",
          400: "#24D6FF",
          500: "#00D4FF",
          600: "#00A3C7",
          700: "#00728F",
          800: "#004157",
          900: "#00101F",
        },
        purple: {
          DEFAULT: "#8B5CF6",
          50: "#E4D9FD",
          100: "#D8C9FC",
          200: "#C1A8FA",
          300: "#A987F8",
          400: "#9266F7",
          500: "#8B5CF6",
          600: "#6A37F3",
          700: "#4F1AD9",
          800: "#3B14A4",
          900: "#280E6F",
        },
        
        // Status Indicator Colors
        status: {
          growing: "hsl(var(--status-growing))",
          established: "hsl(var(--status-established))",
          research: "hsl(var(--status-research))",
          speculative: "hsl(var(--status-speculative))",
        },
        
        // Special Effect Colors
        holographic: "hsl(var(--holographic))",
        electric: "hsl(var(--electric))",
        "glow-green": "hsl(var(--glow-green))",
        "matrix-green": "hsl(var(--matrix-green))",
        
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "holographic": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)" 
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.5)" 
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "holographic": "holographic 3s ease infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "scan": "scan 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
