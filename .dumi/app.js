import { Navigate } from 'dumi';

export const patchClientRoutes = ({ routes }) => {
  routes.unshift({
    path: '/',
    element: <Navigate to="/helixbridge/what_is_helix" replace />,
  });
};
