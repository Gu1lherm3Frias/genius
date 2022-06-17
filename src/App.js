import { useState, useEffect } from 'react'
import Pad from './components/Pad'
import timeout from './utils/timeout'
import './App.css'

export default function App() {
  const [isOn, setIsOn] = useState(false)
  
  const colorList = ['green', 'red', 'yellow', 'blue']
  
  const initPlay = {
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColors: []
  }
  
  const [play, setPlay] = useState(initPlay)
  const [flashColor, setFlashColor] = useState('')

  const startHandle = () => {
    setIsOn(true)
  }

  useEffect(() => {
    if (isOn) 
      setPlay({...initPlay, isDisplay: true})
    else
      setPlay(initPlay)
  }, [isOn])

  useEffect(() => {
    if (isOn && play.isDisplay) {
      let newColor = colorList[Math.floor(Math.random() * 4)]

      const copyColors = [...play.colors]
      copyColors.push(newColor)
      setPlay({...play, colors: copyColors})
    }
  }, [isOn, play.isDisplay])

  useEffect(() => {
    if (isOn && play.isDisplay && play.colors.length) {
      displayColors()
    }
  }, [isOn, play.isDisplay, play.colors.length])

  const displayColors = async () => {
    await timeout(1000)

    for(let i = 0; i < play.colors.length; i++) {
      setFlashColor(play.colors[i])
      console.log(play.colors[i])
      await timeout(1000)
      setFlashColor('')
      await timeout(1000)

      if (i === play.colors.length - 1) {
        const copyColors = [...play.colors]

        setPlay({
          ...play,
          isDisplay: false,
          userPlay: true,
          userColors: copyColors.reverse()
        })
      }
    }
  }

  const padClickHandle = async (color) => {
    if(!play.isDisplay && play.userPlay) {
      const copyUserColors = [...play.userColors]
      const lastColor = copyUserColors.pop()

      setFlashColor(color)

      if (color === lastColor) {
        if (copyUserColors.length) {
          setPlay({...play, userColors: copyUserColors})
        }else {
          await timeout(1000)
          setPlay({...play, isDisplay: true, userPlay: false, score: play.colors.length, userColors: []})
        }
      }else {
        await timeout(1000)
        setPlay({...initPlay, score: play.colors.length})
      }
      await timeout(1000)
      setFlashColor('')
    }
  }

  const closeHandle = () => {
    setIsOn(false)
  }

  return (
    <div className="App">
      <div className="AppContainer">
        <h1 className='title'>Genius</h1>
        <div className="padWrapper">
            {colorList && colorList.map((v, i) => (
              <Pad 
                onClick={() => {
                  padClickHandle(v)
                }} 
                flash={flashColor === v} 
                color={v}
                ></Pad>
            ))}
        </div>

        {isOn && !play.isDisplay && !play.userPlay && play.score && (
          <div className="lost">
            <h2>Try Again!</h2>
            <div>Your best score: {play.score}</div>
            <button onClick={closeHandle}>Close</button>
          </div>
        )}

        {!isOn && !play.score && (
          <button onClick={startHandle} className="startButton">Start</button>
        )}

        {isOn && (play.isDisplay || play.userPlay) && (
          <div className='score'>Score: {play.score}</div>
        )}
      </div>
      <footer className='footer'>
        <h4 className='contributors'>Contributors</h4>
        <nav>
          <a href="https://github.com/Gu1lherm3Frias" target='_blank' rel='noreferrer'>@Gu1lherm3frias</a>
          <a href="https://github.com/quokequack" target='_blank' rel='noreferrer'>@quokequack</a>
        </nav>
      </footer>
    </div>
  )
}

