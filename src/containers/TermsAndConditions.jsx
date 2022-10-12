import { EditorState } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import RichTextEditor from 'react-rte'
import { addUpdateData, getAllData } from '../backend/utility'

const TermsAndConditions = () => {
  const [editorState, setEditorState] = useState(
    RichTextEditor.createEmptyValue(),
  )

  const [TermsAndConditions, setTermsAndConditions] = useState('')

  useEffect(() => {
    getTermsAndConditionsDescription()
  }, [])

  const getTermsAndConditionsDescription = async () => {
    let result = await getAllData('static-data')
    if (result && result.success === true) {
      let item = result.data.find(
        (item) => item.type === 'term_condition',
      )
      if(item) {
        setTermsAndConditions(item)
      }
      // console.log(
      //   editorState.setContentFromString(result.data[0].data, 'html'),
      // )
    }
  }

  const handleEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }

  const onChange = (value) => {
    setEditorState(value)
  }

  const handleSubmit = async (e) => {
    console.log(editorState.setContentFromString('', 'html'))
    console.log(editorState.toString('html'))
    const body = {
      type: 'term_condition',
      data: editorState.toString('html'),
    }
    let result = await addUpdateData('static-data', body)
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
      <h3 className="my-3">Terms and Conditions</h3>
      <div className="col-12">
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

export default TermsAndConditions
