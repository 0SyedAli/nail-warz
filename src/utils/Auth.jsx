export const isAuthenticated = () => {
    if (typeof window === "undefined") {
        return false; // Prevent server-side access
    }
    return sessionStorage.getItem("token");
};