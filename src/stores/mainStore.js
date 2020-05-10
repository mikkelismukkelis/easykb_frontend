import React from 'react'
import { useLocalStore } from 'mobx-react'
import { EditorState, convertFromRaw } from 'draft-js'

const createStateFromRaw = (raw) =>
  EditorState.createWithContent(convertFromRaw(JSON.parse(raw)))

export const MainStoreContext = React.createContext()

const MainStoreProvider = ({ children }) => {
  const mainStore = useLocalStore(() => ({
    // AUTHENTICATION
    user: null,
    setUser: (newUser) => {
      mainStore.user = newUser
    },
    // KB THINGS
    allKBs: [],
    setAllKBs: (kbs) => {
      mainStore.allKBs = kbs
    },
    addOneKB: (kb) => {
      mainStore.allKBs.push(kb)
    },
    removeOneKb: (index) => {
      if (index > -1) {
        mainStore.allKBs.splice(index, 1)
      }
    },
    // TEXT EDITOR THINGS
    editorState: EditorState.createEmpty(),
    setEditorState: (newState) => {
      mainStore.editorState = newState
      // console.log(convertToRaw(mainStore.editorState.getCurrentContent()))
    },
    resetEditorState: () => {
      let emptyEditorState = EditorState.createEmpty()
      mainStore.editorState = emptyEditorState
    },
    get currentState() {
      return mainStore.editorState.getCurrentContent()
    },
    // SEARCH STUFF
    searchValue: null,
    setSearchValue: (newValue) => {
      mainStore.searchValue = newValue

      if (newValue === null) {
        mainStore.resetEditorState()
        mainStore.setEditorReadOnlyTrue()
      } else {
        mainStore.allKBs.map((kb) => {
          if (kb.name === newValue) {
            let newState = createStateFromRaw(kb.currentState)
            mainStore.setEditorState(newState)
            mainStore.setEditorReadOnlyFalse()
          }
          return null
        })
      }
    },
    setSearchValueNew: (newValue) => {
      mainStore.searchValue = newValue
      mainStore.resetEditorState()
    },
    // DELETE BUTTON CONTROL
    deleteBtnDisabled: true,
    setDeleteBtnEnabled: () => {
      mainStore.deleteBtnDisabled = false
    },
    setDeleteBtnDisabled: () => {
      mainStore.deleteBtnDisabled = true
    },
    // SAVE BUTTON CONTROL
    saveBtnDisabled: true,
    setSaveBtnEnabled: () => {
      mainStore.saveBtnDisabled = false
    },
    setSaveBtnDisabled: () => {
      mainStore.saveBtnDisabled = true
    },
    // ADD NEW BUTTON CONTROL
    newBtnDisabled: false,
    setNewBtnEnabled: () => {
      mainStore.newBtnDisabled = false
    },
    setNewBtnDisabled: () => {
      mainStore.newBtnDisabled = true
    },
    // NEW FILE THINGS
    newFileName: null,
    setNewFilename: (nimi) => {
      mainStore.newFileName = nimi
    },
    // EDITOR READONLY CONTROL
    editorReadOnly: true,
    setEditorReadOnlyFalse: () => {
      mainStore.editorReadOnly = false
    },
    setEditorReadOnlyTrue: () => {
      mainStore.editorReadOnly = true
    },
  }))

  return (
    <MainStoreContext.Provider value={mainStore}>
      {children}
    </MainStoreContext.Provider>
  )
}

export default MainStoreProvider
