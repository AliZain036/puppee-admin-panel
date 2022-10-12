import { EditorState } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import RichTextEditor from 'react-rte'
import { addUpdateData, getAllData } from '../backend/utility'

const PrivacyPolicy = () => {
  const [editorState, setEditorState] = useState(
    RichTextEditor.createEmptyValue(),
    // RichTextEditor.createValueFromString(
    //   '<p><u><strong>Privacy policy&nbsp;</strong></u></p>',
    // ),
  )
  const [privacyPolicy, setPrivacyPolicy] = useState(null)

  useEffect(() => {
    getAboutUsDescription()
  }, [])

  const getAboutUsDescription = async () => {
    let result = await getAllData('static-data')
    editorState.setEditorState()
    if (result && result.success === true) {
      let privacyTerms = result.data.find(
        (item) => item.type === 'privacy_policy',
      )
      // console.log(
      //   editorState.setContentFromString(result.data[0].data, 'html'),
      // )
      setPrivacyPolicy(privacyTerms)
      console.log(privacyTerms)
    }
  }

  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }

  const onChange = (value) => {
    setEditorState(value)
  }

  const handleSubmit = async (e) => {
    console.log(editorState)
    console.log(editorState.toString('html'))
    // const body = {
    //   type: 'privacy_policy',
    //   data: editorState.toString('html'),
    // }
    // let result = await addUpdateData('static-data', body)
  }

  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      'INLINE_STYLE_BUTTONS',
      'BLOCK_TYPE_BUTTONS',
      /*'BLOCK_TYPE_DROPDOWN',*/ 'LINK_BUTTONS',
      'HISTORY_BUTTONS',
    ],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD', className: 'text-editor__button' },
      { label: 'Italic', style: 'ITALIC', className: 'text-editor__button' },
      {
        label: 'Underline',
        style: 'UNDERLINE',
        className: 'text-editor__button',
      },
      {
        label: 'Strike-through',
        style: 'STRIKETHROUGH',
        className: 'text-editor__button',
      },
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: 'Normal', style: 'unstyled', className: 'text-editor__button' },
      {
        label: 'Heading Large',
        style: 'header-one',
        className: 'text-editor__button',
      },
      {
        label: 'Heading Medium',
        style: 'header-two',
        className: 'text-editor__button',
      },
      {
        label: 'Heading Small',
        style: 'header-three',
        className: 'text-editor__button',
      },
    ],
    BLOCK_TYPE_BUTTONS: [
      {
        label: 'UL',
        style: 'unordered-list-item',
        className: 'text-editor__button',
      },
      {
        label: 'OL',
        style: 'ordered-list-item',
        className: 'text-editor__button',
      },
    ],
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12">
        <h3 className="my-3">Privacy Policy</h3>
        {/* <Editor /> */}
        <RichTextEditor
          value={editorState}
          onChange={onChange}
          placeholder="Write something"
          toolbarConfig={toolbarConfig}
          spellCheck={true}
        />
        <button className="btn btn-success mt-3" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  )
}

export default PrivacyPolicy
