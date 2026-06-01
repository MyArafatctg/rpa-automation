let accessToken: string = localStorage.getItem("token") ?? "";
let refreshToken: string = localStorage.getItem("refreshToken") ?? "";

export const tokenService = {
  getAccessToken: () => accessToken,
  setAccessToken: (t: string) => (accessToken = t),

  getRefreshToken: () => refreshToken,
  setRefreshToken: (t: string) => (refreshToken = t),

  clear: () => {
    accessToken = "";
    refreshToken = "";
  },
};
