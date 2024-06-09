const routes = {
    public: [
      { path: 'auth/login'},
      { path: 'auth/register' },
      { path: 'index' },
    ],
    admin: [
      { path: 'admin/dashboard' },
      { path: 'admin/settings' },
    ],
    user: [
      { path: 'user/dashboard'},
      { path: 'user/settings' },
    ],
  };
  
  export default routes;
  