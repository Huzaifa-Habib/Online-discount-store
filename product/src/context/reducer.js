export const reducer = (state, action) => {
    switch (action.type) {
  
      case "USER_LOGIN": {
        return { ...state, isLogin: true,user:action.payload }
      }
      case "ADMIN_LOGIN": {
        return { ...state, isAdmin:true ,user:action.payload }
      }
      case "USER_LOGOUT": {
        return { ...state, isLogin: false, isAdmin:false } 
      }
      case "ADMIN_LOGOUT": {
        return { ...state, isAdmin: false, isLogin:false } 
      }
      default: {
        return state
      }
    }
  }