import { EditorState } from 'draft-js'
import React, { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'

const PrivacyPolicy = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12">
        <h3 className="my-3">Privacy Policy</h3>
        <Editor />
      </div>
    </div>
  )
}

export default PrivacyPolicy
