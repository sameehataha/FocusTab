import { createContext,useContext, useState,useReducer} from "react";
import { Reducer } from "../reducer/Reducer";
const initialValue = {
    name: "",
    time: "",
    message: "",
    task: ""
}
const BrowserContext = createContext(initialValue)

const BrwoserProvide = ({children}) => {
    const [{name ,time,message,task},browserDispatch] = useReducer(Reducer,initialValue)
    return (
        <BrowserContext.Provider value={{name,time,message,task,browserDispatch}} >
             {children}
        </BrowserContext.Provider>
    )
}
const useBrowser = () => useContext(BrowserContext)
export {useBrowser,BrwoserProvide}