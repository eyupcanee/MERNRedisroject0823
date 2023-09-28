import jwtDecode from "jwt-decode";

export const authorizeAdmin = async (token) => {
  try {
    if (jwtDecode(token).role === "admin") return true;
    else return false;
  } catch (error) {
    return false;
  }
};

export const getAdminId = async (token) => {
  try {
    if (jwtDecode(token).role === "admin") {
      return jwtDecode(token).id;
    } else return null;
  } catch (error) {
    return null;
  }
};

export const authorizeEditor = async (token) => {
  try {
    if (jwtDecode(token).role === "editor") return true;
    else return false;
  } catch (error) {
    return false;
  }
};

export const getEditorId = async (token) => {
  try {
    if (jwtDecode(token).role === "editor") {
      return jwtDecode(token).id;
    } else return null;
  } catch (error) {
    return null;
  }
};
