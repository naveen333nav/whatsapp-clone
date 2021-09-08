import React, { useState } from 'react'
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core'
import {
  AddPhotoAlternate,
  ArrowBack,
  EventNote,
  MoreVert,
} from '@material-ui/icons'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import Compressor from 'compressorjs'

import ChatMessages from './ChatMessages'
import ChatFooter from './ChatFooter'
import MediaPreview from './MediaPreview'
import useRoom from '../hooks/useRoom'
import { createTimestamp, storage, db } from '../firebase'
import './Chat.css'

export default function Chat({ user, page }) {
  const [image, setImage] = useState(null)
  const [src, setSrc] = useState('')
  const [input, setInput] = useState('')

  const { roomId } = useParams()
  const room = useRoom(roomId, user.uid)
  const history = useHistory()

  const onChange = (event) => {
    setInput(event.target.value)
  }

  const sendMessage = async (event) => {
    event.preventDefault()
    if (input.trim() || (input === '' && image)) {
      setInput('')
      if (image) {
        closePreview()
      }
      const imageName = uuid()
      const newMessage = image
        ? {
            name: user.displayName,
            message: input,
            uid: user.uid,
            timestamp: createTimestamp(),
            time: new Date().toUTCString(),
            imageUrl: 'uploading',
            imageName,
          }
        : {
            name: user.displayName,
            message: input,
            uid: user.uid,
            timestamp: createTimestamp(),
            time: new Date().toUTCString(),
          }

      await db
        .collection('users')
        .doc(user.uid)
        .collection('chats')
        .doc(roomId)
        .set({
          name: room.name,
          photoURL: room.photoURL || null,
          timestamp: createTimestamp(),
        })

      const doc = await db
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .add(newMessage)

      if (image) {
        new Compressor(image, {
          quality: 0.8,
          maxWidth: 1920,
          async success(result) {
            setSrc('')
            setImage(null)
            await storage.child(imageName).put(result)
            const url = await storage.child(imageName).getDownloadURL()

            db.collection('rooms')
              .doc(roomId)
              .collection('messages')
              .doc(doc.id)
              .update({
                imageUrl: url,
              })
          },
        })
      }
    }
  }

  const showPreview = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setSrc(reader.result)
      }
    }
  }

  const closePreview = () => {
    setSrc('')
    setImage(null)
  }

  return (
    <div className='chat'>
      <div style={{ height: page.height }} className='chat__background' />

      <div className='chat__header'>
        {page.isMobile && (
          <IconButton onClick={() => history.goBack()}>
            <ArrowBack />
          </IconButton>
        )}
        <div className='avatar__container'>
          <Avatar src={room?.photoURL} />
        </div>
        <div className='chat__header--info'>
          <h3 style={{ width: page.isMobile && page.width - 165 }}>
            {' '}
            {room?.name}
          </h3>
        </div>

        <div className='chat__header--right'>
          <input
            id='image'
            style={{ display: 'none' }}
            accept='image/*'
            type='file'
            onChange={showPreview}
          />
          <IconButton>
            <label style={{ cursor: 'pointer', height: 24 }} htmlFor='image'>
              <AddPhotoAlternate />
            </label>
          </IconButton>

          <IconButton>
            <MoreVert />
          </IconButton>
          <Menu id='menu' keepMounted open={false}>
            <MenuItem>DeleteRoom</MenuItem>
          </Menu>
        </div>
      </div>
      <div className='chat__body--container'>
        <div className='chat__body' style={{ height: page.height - 68 }}>
          <ChatMessages />
        </div>
      </div>

      <MediaPreview src={src} closePreview={closePreview} />
      <ChatFooter
        input={input}
        onChange={onChange}
        sendMessage={sendMessage}
        image={image}
        user={user}
        room={room}
        roomId={roomId}
      />
    </div>
  )
}
