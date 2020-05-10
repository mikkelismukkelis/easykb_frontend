import React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export const AddNewDialog = ({
  newDialogOpen,
  handleCloseNewDialog,
  handleAddBtnClick,
}) => {
  return (
    <div>
      <Dialog
        open={newDialogOpen}
        onClose={handleCloseNewDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new KB</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Describe all important words for this instruction. These words are
            used in searches. You can think this "name" more like tags.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name / tags"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddBtnClick} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
