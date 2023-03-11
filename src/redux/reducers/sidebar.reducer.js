const initialState = {
  open : false
};

export const HIDE_SIDEBAR = "HIDE_SIDEBAR";
export const SHOW_SIDEBAR = "SHOW_SIDEBAR";

export function sidebarReducer(state = initialState, action) {
  switch(action.type){
    case HIDE_SIDEBAR:
      return {open: false};
    case SHOW_SIDEBAR:
      return {open: true};
    default: 
      return state ;
  };
};