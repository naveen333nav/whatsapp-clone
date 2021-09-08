import React, { useState } from 'react'
import {
  Send,
  MicRounded,
  CancelRounded,
  CheckCircleRounded,
} from '@material-ui/icons'
import './ChatFooter.css'

export default function ChatFooter({
  input,
  onChange,
  sendMessage,
  image,
  user,
  room,
  roomId,
}) {
  const [isRecording, setIsRecording] = useState(false)
  const btnIcons = (
    <>
      <Send
        style={{
          width: 20,
          height: 20,
          color: 'white',
        }}
      />
      <MicRounded
        style={{
          height: 24,
          width: 24,
          color: 'white',
        }}
      />
    </>
  )

  const canRecord = navigator.mediaDevices.getUserMedia && window.MediaRecorder
  return (
    <div className='chat__footer'>
      <form>
        <input
          type='text'
          placeholder='type a message'
          value={input}
          onChange={!isRecording ? onChange : null}
        />

        {canRecord ? (
          <button
            type='submit'
            className='send__btn'
            onClick={
              input.trim() || (input === '' && image)
                ? sendMessage
                : () => false
            }
          >
            {btnIcons}
          </button>
        ) : (
          <>
            <label htmlFor='capture' className='send__btn'>
              {btnIcons}
            </label>
            <input
              type='file'
              style={{ display: 'none' }}
              id='capture'
              accept='audio/*'
              capture
            />
          </>
        )}
      </form>
      {isRecording && (
        <div className='record'>
          <CancelRounded
            style={{
              width: 30,
              height: 30,
              color: '#f20519',
            }}
          />
          <div>
            <div className='record__redcircle'></div>
            <div className='record__duration'></div>
          </div>
          <CheckCircleRounded
            style={{
              width: 30,
              height: 30,
              color: '#41bf49',
            }}
          />
        </div>
      )}
    </div>
  )
}
