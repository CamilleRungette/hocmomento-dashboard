import { LOG_USER, LOGOUT } from "../reducers/login.reducer";

const logUser = () => ({
  type: LOG_USER
});

const logOut = () => ({
  type: LOGOUT
})

const functions = {logUser, logOut};
export default functions;