export const loginTemplate = {
  id: 'loginTemplate',
  name: 'Login Screen UI',
  shapes: [
    {
      id: 'title',
      type: 'text',
      position: { x: 100, y: 40 },
      text: 'Welcome Back',
      style: {
        width: 200,
        height: 50,
        backgroundColor: 'transparent',
        fontSize: 22,
        fontWeight: 'bold',
      },
    },
    {
      id: 'emailField',
      type: 'rectangle',
      position: { x: 80, y: 120 },
      text: 'Email',
      style: {
        width: 240,
        height: 50,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
      },
    },
    {
      id: 'passwordField',
      type: 'rectangle',
      position: { x: 80, y: 190 },
      text: 'Password',
      style: {
        width: 240,
        height: 50,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
      },
    },
    {
      id: 'loginBtn',
      type: 'rectangle',
      position: { x: 80, y: 270 },
      text: 'Login',
      style: {
        width: 240,
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        color: '#fff',
      },
    },
  ],
  lines: [],
};
