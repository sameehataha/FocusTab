import {images} from './db/images.js'
import { Home } from  "./pages/Home/Home.jsx"
import './index.css'
import { useBrowser } from './context/browser-extension.jsx'
import { Task } from './pages/Home/Task.jsx'
import { useEffect } from 'react'
import { Reducer } from './reducer/Reducer.jsx'

const index = Math.floor(Math.random() * images.length)
const bgImage = images[index].image
  // console.log(bgImage)
function App() {
  const {name, browserDispatch} = useBrowser()

  console.log("name -", name)
  useEffect(() => {
    const userName = localStorage.getItem("name")
      browserDispatch({
        type: "NAME",
        payload: userName
      })
  }, [])
  return (

    <div className='app' style={{backgroundImage: `url("${bgImage}")`}}>
       { name ? <Task /> : <Home /> }
    </div>

  )
}

export default App
