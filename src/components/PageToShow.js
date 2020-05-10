import React, { useEffect, useState } from 'react'
import axios from 'axios'

// MATERIAL UI
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'

// COMPONENTS
import { TopBar } from './TopBar'
// import { SideBar } from './SideBar'
import { TextArea } from './TextArea'

// STORE
import { useObserver } from 'mobx-react'
import { MainStoreContext } from '../stores/mainStore'

// Variables
const apiUserUrl = '/api/user'
const apiKbUrl = '/api/kbarticle'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  proggress: {
    position: 'absolute',
  },
}))

const PageToShow = () => {
  const store = React.useContext(MainStoreContext)

  const LoginPage = () => {
    const classes = useStyles()
    const [componentsDisabled, setComponentsDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      const loggedInUserJSON = window.localStorage.getItem('loggedInEasyKbUser')
      if (loggedInUserJSON) {
        console.log('Found user from local storage, signing in.')
        const user = JSON.parse(loggedInUserJSON)
        store.setUser(user)
      }
    }, [])

    const signInSubmit = (e) => {
      e.preventDefault()
      setLoading(true)
      setComponentsDisabled(true)

      const user = {
        email: e.target.email.value,
        password: e.target.password.value,
      }

      axios
        .post(`${apiUserUrl}/login`, user)
        .then((res) => {
          window.localStorage.setItem(
            'loggedInEasyKbUser',
            JSON.stringify(res.data)
          )
          store.setUser(res.data)
        })
        .catch((err) => {
          console.log('Error in login: ', err.response.data)
          alert(err.response.data)
          setLoading(false)
          setComponentsDisabled(false)
        })
    }

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={signInSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              disabled={componentsDisabled}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              disabled={componentsDisabled}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={componentsDisabled}
            >
              Sign In Login
              {loading ? (
                <CircularProgress
                  color="secondary"
                  className={classes.proggress}
                  size="4rem"
                />
              ) : null}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password? (NOT IN USE)
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  Register (NOT IN USE)
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    )
  }

  const EditorPage = () => {
    // Lets get all KBs from database
    useEffect(() => {
      const config = {
        headers: { 'auth-token': store.user.token },
      }
      axios.get(apiKbUrl, config).then((res) => {
        store.setAllKBs(res.data)
      })
    }, [])

    return useObserver(() => (
      <div>
        <TopBar />
        {/* <SideBar /> */}
        <TextArea />
      </div>
    ))
  }

  return useObserver(() => (
    <div>{store.user === null ? <LoginPage /> : <EditorPage />}</div>
  ))
}

export default PageToShow
