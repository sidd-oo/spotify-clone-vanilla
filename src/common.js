export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const TOKEN_TYPE = "TOKEN_TYPE";
export const EXPIRES_IN = "EXPIRES_IN";
const APP_URL = import.meta.env.VITE_APP_URL;


export const ENDPOINT = {
    userInfo: "me",
    featuredPlayist: "browse/featured-playlists?limit=5",
    toplists: "browse/categories/toplists/playlists?limit=10",
    playlist: "playlists"
}

export const logout = () => {
    const accessToken = localStorage.removeItem(ACCESS_TOKEN);
    const tokenType = localStorage.removeItem(TOKEN_TYPE);
    const expiresIn = localStorage.removeItem(EXPIRES_IN);
    location.href = APP_URL;
}
 