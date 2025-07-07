export const isAdminLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("admin");
  };
  
  export const loginAdmin = () => {
    localStorage.setItem("admin", "true");
  };
  
  export const logoutAdmin = () => {
    localStorage.removeItem("admin");
  };
  