// Basic shit
import React, { Fragment } from 'react'

// Store
import MainStoreProvider from './stores/mainStore'

// Components
import PageToShow from './components/PageToShow'

// Material UI things
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5B9FC4',
    },
    secondary: {
      main: '#c46a5b',
    },
  },
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <MainStoreProvider>
        <Fragment>
          <CssBaseline />
          <PageToShow />
        </Fragment>
      </MainStoreProvider>
    </ThemeProvider>
  )
}

export default App
