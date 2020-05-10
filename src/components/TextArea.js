import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { makeStyles } from '@material-ui/core/styles'
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { MainStoreContext } from '../stores/mainStore'
import { useObserver } from 'mobx-react'

const styles = makeStyles((theme) => ({
  root: {
    width: '95%',
    margin: 'auto',
    background: 'white',
    borderStyle: 'solid',
    borderColor: '#DFDFDF',
  },
}))

export const TextArea = () => {
  const store = React.useContext(MainStoreContext)

  const classes = styles()

  const handleEditorStateChange = (editorState) => {
    let containsText = store.editorState.getCurrentContent().hasText()
    let undoStackSize = store.editorState.getUndoStack().size
    let searchValue = store.searchValue

    if (containsText && undoStackSize > 0 && searchValue) {
      store.setSaveBtnEnabled()
    }
    store.setEditorState(editorState)
  }

  return useObserver(() => (
    <div className={classes.root}>
      <Editor
        editorState={store.editorState}
        onEditorStateChange={handleEditorStateChange}
        readOnly={store.editorReadOnly}
        toolbar={{
          options: [
            'inline',
            'blockType',
            'fontSize',
            'fontFamily',
            'list',
            'textAlign',
            'colorPicker',
            'link',
            'embedded',
            'emoji',
            'image',
            'remove',
            'history',
          ],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
        }}
      />
    </div>
  ))
}
