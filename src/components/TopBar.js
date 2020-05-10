import React, { useState } from 'react'
import axios from 'axios'

// draftjs
import { convertToRaw } from 'draft-js'

// components
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'
import { AddNewDialog } from './AddNewDialog'
import { SearchInput } from './SearchInput'

// MUI
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
// import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import Add from '@material-ui/icons/Add'
import ExitToApp from '@material-ui/icons/ExitToApp'
import CircularProgress from '@material-ui/core/CircularProgress'

// store things
import { MainStoreContext } from '../stores/mainStore'
import { useObserver } from 'mobx-react'

// Variables
const apiKbUrl = '/api/kbarticle'

const styles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '45%',
    marginRight: '1%',
  },
  proggress: {
    position: 'absolute',
  },
}))

export const TopBar = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const classes = styles()
  const store = React.useContext(MainStoreContext)

  // COnfiguration to add token to headers
  const headersConfig = {
    headers: { 'auth-token': store.user.token },
  }

  // BUTTON CLICKS
  const deleteBtnClick = () => {
    handleOpenDeleteDialog()
  }

  const saveBtnClick = () => {
    setSaving(true)

    let newKB = {
      name: store.searchValue,
      currentState: JSON.stringify(convertToRaw(store.currentState)),
    }

    // Let's check if totally ne kb or existing kb to be updated
    if (store.allKBs.some((kb) => kb.name === newKB.name)) {
      // UPDATING
      let kbNameToBeModified = store.searchValue

      let kbIdtobeModified = store.allKBs.find(
        (kb) => kb.name === kbNameToBeModified
      ).id

      let kbIndextobeModified = store.allKBs.findIndex(
        (kb) => kb.name === kbNameToBeModified
      )

      axios
        .put(`${apiKbUrl}/${kbIdtobeModified}`, newKB, headersConfig)
        .then((res) => {
          // console.log('response: ', res.data)
          store.addOneKB(res.data)
          store.removeOneKb(kbIndextobeModified)
          store.setDeleteBtnEnabled()
          store.setSaveBtnDisabled()
          // console.log('store all kbs: ', store.allKBs)
          setSaving(false)
        })
        .catch((error) => {
          setSaving(false)
          console.log('Error in updating kb: ', error)
        })
    } else {
      // SAVING NEW
      axios
        .post(apiKbUrl, newKB, headersConfig)
        .then((res) => {
          // console.log('response: ', res.data)
          store.addOneKB(res.data)
          store.setDeleteBtnEnabled()
          store.setSaveBtnDisabled()
          // console.log('store all kbs: ', store.allKBs)
          setSaving(false)
        })
        .catch((error) => {
          setSaving(false)
          console.log('Error in saving kb: ', error)
        })
    }
  }

  const addNewBtnClick = () => {
    store.resetEditorState()
    handleOpenNewDialog()
  }

  const logoutBtnClick = () => {
    store.setUser(null)
    localStorage.removeItem('loggedInEasyKbUser')
  }

  // DIALOG HANDLING
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  const handleDeleteYesBtnClick = (e) => {
    e.preventDefault()
    setDeleting(true)
    let kbNameToBeDeleted = store.searchValue

    let kbIdtobeDeleted = store.allKBs.find(
      (kb) => kb.name === kbNameToBeDeleted
    ).id

    let kbIndextobeDeleted = store.allKBs.findIndex(
      (kb) => kb.name === kbNameToBeDeleted
    )

    if (kbNameToBeDeleted === '') {
      handleCloseDeleteDialog()
      return
    }

    axios
      .delete(`${apiKbUrl}/${kbIdtobeDeleted}`, headersConfig)
      .then((res) => {
        // console.log('response: ', res.data)
        store.removeOneKb(kbIndextobeDeleted)
        store.setSearchValue(null)
        store.setDeleteBtnDisabled()
        store.setSaveBtnDisabled()
        setDeleting(false)
        handleCloseDeleteDialog()
      })
      .catch((error) => {
        setDeleting(false)
        console.log('Error in deleting: ', error)
      })
  }

  const handleOpenNewDialog = () => {
    setNewDialogOpen(true)
  }

  const handleCloseNewDialog = () => {
    setNewDialogOpen(false)
  }

  const handleAddBtnClick = (e) => {
    e.preventDefault()
    let newFilename = document.getElementById('name').value
    if (newFilename === '') {
      handleCloseNewDialog()
      return
    }

    if (store.allKBs.some((kb) => kb.name === newFilename)) {
      alert(
        'There is already KB with this name. If you really want to save new document with this name, you need first to delete old KB.'
      )
      return
    } else {
      store.setNewFilename(newFilename)
      store.setSearchValueNew(newFilename)
      store.setSaveBtnEnabled()
      store.resetEditorState()
      store.setEditorReadOnlyFalse()
      handleCloseNewDialog()
    }
  }

  return useObserver(() => (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.root}>
          <SearchInput />

          {/* BUTTONS */}
          <div className={classes.buttons}>
            <Button
              disabled={store.deleteBtnDisabled}
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<DeleteIcon />}
              onClick={deleteBtnClick}
            >
              Delete
            </Button>
            <Button
              disabled={store.saveBtnDisabled}
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<SaveIcon />}
              onClick={saveBtnClick}
            >
              Save
              {saving ? (
                <CircularProgress
                  color="secondary"
                  className={classes.proggress}
                  size="3rem"
                />
              ) : null}
            </Button>
            <Button
              onClick={addNewBtnClick}
              disabled={store.newBtnDisabled}
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<Add />}
            >
              Add new
            </Button>
            <Button
              onClick={logoutBtnClick}
              // disabled={store.newBtnDisabled}
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<ExitToApp />}
            >
              Log out
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleDeleteYesBtnClick={handleDeleteYesBtnClick}
        deleting={deleting}
      />

      {/* NEW KB SAVE DIALOG */}
      <AddNewDialog
        newDialogOpen={newDialogOpen}
        handleCloseNewDialog={handleCloseNewDialog}
        handleAddBtnClick={handleAddBtnClick}
      />
    </div>
  ))
}
