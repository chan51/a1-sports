class ProfileReducer {
  init = (initialCount = {}) => {
    return { profiles: initialCount };
  };

  reducer = (state, action) => {
    switch (action.type) {
      case 'fetchall':
        return { ...state.profiles };
      case 'addprofile':
        return { profiles: { ...state.profiles, ...action.data } };
      case 'reset':
        return this.init(action.payload);
      default:
        throw new Error();
    }
  };
}

export default ProfileReducer;
