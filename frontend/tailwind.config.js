export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    colors: {
      'debo-blue': '#1a365d',
      'debo-light-blue': '#4299e1',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
};
import forms from '@tailwindcss/forms';

export const plugins = [
  forms,
];