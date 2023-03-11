const initialState = {
  logged : false
};

export const LOG_USER = "LOG_USER";
export const LOGOUT = "LOGOUT";

export function loginReducer(state = initialState, action) {
  switch(action.type){
    case LOG_USER:
      return {...state, logged: true} ;
    case LOGOUT:
      return {...state, logged: false}
    default: 
      return state ;
  };
};