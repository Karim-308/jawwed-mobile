// redux/actions/themeActions.js
export const toggleDarkMode = () => ({
  type: 'TOGGLE_DARK_MODE',
});

export const setDarkMode = (value) => ({
  type: 'SET_DARK_MODE',
  payload: value,
});
