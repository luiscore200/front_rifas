const routes = {
    public: [
      { path: 'auth/login'},
      { path: 'auth/register' },
      { path: 'index' },
      { path: '/' },
    ],
    admin: [
      { path: 'admin/dashboard' },
      { path: 'admin/editUser' },
      { path: 'admin/userCreate' },
      { path: 'admin/adminConfig' },
      { path: 'index' },
      { path: '/' },
    ],
    user: [
      { path: 'user/rifa/dashboard'},
      { path: 'user/rifa/createRifa' },
      { path: 'user/rifa/updateRifa' },
      { path: 'user/rifa/verRifa' },
      { path: 'user/rifa/numbers/assignWinner' },
      { path: 'user/rifa/numbers/assignNumber' },
      { path: 'user/rifa/numbers/assignClient' },
      { path: 'user/userSettings' },
      { path: 'user/rifa/numbers/dashboard' },
      { path: 'user/suscripcion' },
      { path: 'index' },
      { path: '/' },
    ],
  };
  
  export default routes;
  