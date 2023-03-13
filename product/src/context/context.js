import React, { createContext, useReducer } from 'react'
import { reducer } from './reducer';

export const GlobalContext = createContext("Initial Value");

let data = {
  isLogin: null,
  isAdmin:null,
  // isGoogleUserLogin:null,
  baseUrl: (window.location.href.split(":")[0] === "http")?"http://localhost:5001":"",
  user:{},

}

export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}