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
    }
  } catch (error) {
    return null;
  }
};
