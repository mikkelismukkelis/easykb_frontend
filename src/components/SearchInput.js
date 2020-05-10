import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MainStoreContext } from '../stores/mainStore'
import { useObserver } from 'mobx-react'

export const SearchInput = () => {
  // const [value, setValue] = React.useState()
  const store = React.useContext(MainStoreContext)

  return useObserver(() => (
    <div
      style={{ width: '50%', backgroundColor: '#primary', marginLeft: '1%' }}
    >
      <Autocomplete
        onChange={(event, newValue, reason) => {
          if (newValue && newValue.inputValue) {
            store.setSearchValue({
              title: newValue.inputValue,
            })
            return
          }
          // setValue(newValue)
          setTimeout(() => store.setSearchValue(newValue), 200)
          if (newValue === null) {
            store.setDeleteBtnDisabled()
            store.setSaveBtnDisabled()
            store.resetEditorState()
          } else {
            store.setDeleteBtnEnabled()
            // store.setSaveBtnEnabled()
          }
        }}
        color="secondary"
        id="searchfield"
        freeSolo
        value={store.searchValue}
        options={store.allKBs.map((kb) => kb.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="SEARCH"
            margin="dense"
            variant="outlined"
            color="secondary"
            autoFocus
          />
        )}
      />
    </div>
  ))
}
