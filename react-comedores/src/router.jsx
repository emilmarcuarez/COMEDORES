import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import AuthLayout from './layouts/AuthLayout'
import Inicio from './views/Inicio'
import CPanel from './views/CPanel'
import Login from './views/login'
import Personal from './views/Personal'
import Productos from './views/Productos'
import Usuarios from './views/Usuario'
import Departamentos from './views/Departamentos'
import Registro from './views/Registro'
import Empresas from './views/Empresas'
import Ordenes from './views/Ordenes'
import Resumen from './views/Resumen'
// permite crear las rutas
const router = createBrowserRouter([
   {
      // al entrar / muestra ese componente de layout, siempre en mayuscula la primera letra
        path: "/",
        element: <Layout />,
        children: [
            {
                 // index true es que cuando se visite auth se carga login dentro de authlogin
               index:true,
               element: <Inicio />
            },
        ]
   },
   {
         path: '/auth',
        element: <AuthLayout />,
        children:[
            {
            //  si se quita index se tiene que crear una ruta para el componente por el path
               path:'/auth/login',
               element: <Login />
            },
            {
               path:'/auth/registro',
               element: <Registro />
            }
        ]
   },
   
   {
    path: '/cpanel',
    element:<CPanel />,
   children: [
      { path: 'productos', element: <Productos /> },
      { path: 'empresas', element: <Empresas /> },
      { path: 'departamentos', element: <Departamentos /> },
      { path: 'personal', element: <Personal /> },
      { path: 'usuarios', element: <Usuarios />},
      { path: 'ordenes', element: <Ordenes />},
      { path: 'resumen', element: <Resumen />},
    ]
   },

]);

export default router
