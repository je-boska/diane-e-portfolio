import React, { useState } from 'react'
import './PostSectionForm.css'
import { uploadImage, deleteImage } from '../../requests/EditPostRequests'
import Loader from '../Loader/Loader'
import { SketchPicker } from 'react-color'

const PostSectionForm = ({
  values,
  setSections,
  setFont,
  setCentered,
  setTitle,
  setText,
  setImage,
  setColor,
  setBackgroundColor,
  setSectionId,
  setLoading,
  token,
  setSectionSaved,
  setImageCleanupPublish,
}) => {
  const {
    sections,
    font,
    centered,
    title,
    text,
    image,
    color,
    backgroundColor,
    sectionId,
    loading,
    imageCleanupPublish,
  } = values
  const [selectColor, setSelectColor] = useState(false)
  const [selectBackgroundColor, setSelectBackgroundColor] = useState(false)

  const submitSectionHandler = e => {
    e.preventDefault()
    if (sectionId) {
      const sectionToReplaceIndex = sections.findIndex(
        section => section.sectionId === sectionId
      )
      const newSections = sections
      newSections[sectionToReplaceIndex] = {
        sectionId,
        font,
        centered,
        title,
        text,
        image,
        color,
        backgroundColor,
      }
      setSections(newSections)
    } else {
      if (sections.length < 4) {
        setSections([
          ...sections,
          {
            sectionId: Math.random().toString(36).substring(2, 9),
            font,
            centered,
            title,
            text,
            image,
            color,
            backgroundColor,
          },
        ])
      } else {
        alert('Post is already full')
        return
      }
    }
    setFont('format1452')
    setCentered(false)
    setTitle('')
    setText('')
    setImage('')
    setColor('#FFFFFF')
    setBackgroundColor('#000000')
    setSectionId('')
    setSectionSaved(true)
  }

  const fontHandler = e => {
    setFont(e.target.value)
    setSectionSaved(false)
  }

  const titleHandler = e => {
    setTitle(e.target.value)
    setSectionSaved(false)
  }

  const textHandler = e => {
    setText(e.target.value)
    setSectionSaved(false)
  }

  const uploadHandler = async e => {
    if (image && !sectionId) {
      deleteImage(image, token)
    } else if (image && sectionId) {
      setImageCleanupPublish(imageCleanupPublish.concat(image))
    }
    setLoading(true)
    const imageUrl = await uploadImage(e.target.files[0], token)
    setImage(imageUrl)
    setLoading(false)
    setSectionSaved(false)
  }

  function removeImageHandler(e) {
    e.preventDefault()
    if (!sectionId) {
      deleteImage(image, token)
    } else {
      setImageCleanupPublish(imageCleanupPublish.concat(image))
    }
    setImage('')
  }

  function setColorHandler(color) {
    setColor(color.hex)
  }

  function setBackgroundColorHandler(color) {
    setBackgroundColor(color.hex)
  }

  return (
    <>
      <form onSubmit={submitSectionHandler}>
        <button className='save-button' type='submit' disabled={loading}>
          {loading ? <Loader /> : <h3>SAVE</h3>}
        </button>
        <br />
        <div className='centered-checkbox'>
          <input
            type='checkbox'
            id='centered'
            name='centered'
            checked={centered}
            onChange={() => setCentered(!centered)}
          />
          <label htmlFor='centered'>Centered</label>
        </div>
        <select
          name='font-select'
          className='font-select'
          value={font}
          onChange={fontHandler}
        >
          <option value='pyromaani'>Pyromaani</option>
          <option value='modell-envelo'>Modell Envelo</option>
          <option value='synuous-bold'>Synuous Bold</option>
          <option value='rbno31'>RBNo3.1</option>
        </select>
        <br />

        <input
          name='title'
          size='50'
          id='title'
          placeholder='Title'
          value={title}
          onChange={titleHandler}
        ></input>
        <br />
        <textarea
          name='text'
          rows='10'
          cols='50'
          id='text'
          placeholder='Text'
          value={text}
          onChange={textHandler}
        ></textarea>
        <br />

        <div className='color-selectors'>
          <div className='color-selector'>
            <p>Background</p>
            <div
              className='color-preview'
              style={{ backgroundColor: backgroundColor }}
              onClick={() => setSelectBackgroundColor(!selectBackgroundColor)}
            ></div>
          </div>

          <div className='color-selector'>
            <p>Text</p>
            <div
              className='color-preview'
              style={{ backgroundColor: color }}
              onClick={() => setSelectColor(!selectColor)}
            ></div>
          </div>
        </div>
        <div className='color-pickers'>
          {selectBackgroundColor ? (
            <SketchPicker
              width={180}
              disableAlpha={true}
              color={backgroundColor}
              onChange={setBackgroundColorHandler}
            />
          ) : null}
          {selectColor ? (
            <SketchPicker
              width={180}
              disableAlpha={true}
              color={color}
              onChange={setColorHandler}
            />
          ) : null}
        </div>

        {image && !loading && (
          <button onClick={removeImageHandler} id='remove-img-button'>
            <h3>- REMOVE IMAGE</h3>
          </button>
        )}
        <div className='image-upload-container'>
          <label className={`image-upload-btn ${loading && 'disabled'}`}>
            {loading ? <Loader /> : !image ? '+ ADD IMAGE' : '+ REPLACE IMAGE'}
            <input
              type='file'
              accept='image/png, image/jpg, image/jpeg'
              onChange={uploadHandler}
            />
          </label>
        </div>
        {image && !loading && (
          <div className='image-preview'>
            <img src={image} alt={title} />
          </div>
        )}
      </form>
    </>
  )
}

export default PostSectionForm
