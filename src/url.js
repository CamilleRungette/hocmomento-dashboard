const url =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.REACT_APP_BACK_END;

export default url;
