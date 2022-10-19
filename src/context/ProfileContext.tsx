import React from 'react';

export const profileConfig = {
  profiles: {},
  updateProfiles: newProfile => {
    profileConfig.profiles = { ...profileConfig.profiles, ...newProfile };
  },
};

const ProfileContext = React.createContext(profileConfig);
export default ProfileContext;
