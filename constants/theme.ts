// styles/theme.ts
export const getStyles = (theme: 'light' | 'dark') => ({
  container: {
    flex: 1,
    backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
    padding: 20,
  },
  text: {
    color: theme === 'dark' ? '#FFFFFF' : '#000000',
    fontSize: 16,
  },
});
