import React, { useEffect, useState } from 'react'
import { getAllData, updateRecord } from '../backend/utility'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {
  EditorState,
  convertToRaw,
  convertFromHTML,
  ContentState,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Swal from 'sweetalert2'

const PrivacyPolicy = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  
  useEffect(() => {
    getAboutUsDescription()
  }, [])

  const getAboutUsDescription = async () => {
    let result = await getAllData('static-data')
    if (result.success === true) {
      const res = result.data.find(
        (el) => el._id === '63447b7cd9e33b9da49793f8',
      )
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(convertFromHTML(res.data)),
        ),
      )
    }
  }

  const onChange = (value) => {
    setEditorState(value)
  }

  const handleSubmit = async (e) => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    const body = {
      type: 'about_us',
      data: html,
    }
    let result = await updateRecord(
      'static-data/63447b7cd9e33b9da49793f8',
      body,
    )
    if (result.success === true) {
      Swal.fire({
        title: 'About Us Saved Successfully!',
        icon: 'success',
        timer: 2000,
      })
    }
  }

  return (
    <div className="row animated fadeIn">
      <div className="col-12">
        <h3 className="my-3">About Us</h3>
        <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onChange}
        />
        <button className="btn btn-success mt-3" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  )
}

export default PrivacyPolicy
