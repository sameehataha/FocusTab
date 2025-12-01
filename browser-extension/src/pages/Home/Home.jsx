import { useBrowser } from "../../context/browser-extension"
export const Home = () => {
    const {name, browserDispatch} = useBrowser()
    const handleNameChange = (event) => {
        if(event.key === "Enter" && event.target.value.length > 0){
            browserDispatch({
                type: "NAME",
                payload: event.target.value
            },[])
            localStorage.setItem("name",event.target.value)
        }
    }
    const handleFormSubmit = (event) => {
        event.preventDefault()
    }
    
  return(
    <div className="home-container d-flex direction-column justify-center  align-center gap-lg">
      <h1 className="main-heading">Browser Extension</h1>
      <div className="user-details">
        <span className="heading-1">Hello, what's your Name?</span>
        <form onSubmit={handleFormSubmit}>
            <input required onKeyDown={handleNameChange} className="input" autoFocus/>
        </form>
      </div>
    </div>
  )
}


