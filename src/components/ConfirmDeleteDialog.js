import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = makeStyles((theme) => ({
  proggress: {
    position: 'absolute',
  },
}))

export const ConfirmDeleteDialog = ({
  deleteDialogOpen,
  handleCloseDeleteDialog,
  handleDeleteYesBtnClick,
  deleting,
}) => {
  const classes = styles()

  return (
    <div>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete confirmation</DialogTitle>
        <DialogContent>
          {deleting ? (
            <CircularProgress
              color="secondary"
              className={classes.proggress}
              size="3rem"
            />
          ) : (
            <DialogContentText>
              Do you really want to delete selected KB?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            NO
          </Button>
          <Button onClick={handleDeleteYesBtnClick} color="primary">
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
