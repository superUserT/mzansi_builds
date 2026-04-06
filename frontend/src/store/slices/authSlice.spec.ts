import authReducer, { setCredentials, logout } from "./authSlice";

describe("authSlice", () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    token: null,
  };

  it("should handle setCredentials", () => {
    const payload = {
      user: { id: "1", username: "testuser", email: "test@example.com" },
      accessToken: "jwt_token",
    };

    const state = authReducer(initialState, setCredentials(payload));

    expect(state.user).toEqual(payload.user);
    expect(state.token).toEqual("jwt_token");
    expect(state.isAuthenticated).toBe(true);
  });

  it("should handle logout", () => {
    const stateWithUser = {
      user: { id: "1", username: "testuser", email: "test@example.com" },
      isAuthenticated: true,
      token: "jwt_token",
    };

    const state = authReducer(stateWithUser, logout());

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });
});
