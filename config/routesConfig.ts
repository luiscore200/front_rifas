const routes = {
    public: [
      { path: 'auth/login'},
      { path: 'auth/register' },
      { path: 'index' },
    ],
    admin: [
      { path: 'admin/dashboard' },
      { path: 'admin/editUser' },
      { path: 'admin/userCreate' },
    ],
    user: [
      { path: 'user/rifa/dashboard'},
      { path: 'user/rifa/createRifa' },
      { path: 'user/rifa/updateRifa' },
      { path: 'user/userSettings' },
    ],
  };
  
  export default routes;
  