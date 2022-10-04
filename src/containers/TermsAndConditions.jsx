import { EditorState } from 'draft-js'
import React, { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'

const TermsAndConditions = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }

  return (
    <div className="row animated fadeIn">
      <h3 className="my-3">Terms and Conditions</h3>
      <div className="col-12">
        <Editor />
      </div>
    </div>
  )
}

export default TermsAndConditions
