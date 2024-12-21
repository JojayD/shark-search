// pages/_app.tsx

import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

// Create a default MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize as needed
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>Shark Seek</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}
