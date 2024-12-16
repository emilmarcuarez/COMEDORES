import { NavLink, Outlet } from 'react-router-dom'

export default function CPanel(){
    return(
        <div>
            <div className='bg-blue-950 p-7'>
                <h1 className='text-xl font-bold text-center text-white'>CPanel</h1>
            </div>
            <div className='bg-blue-900 p-2'>
                <nav className='text-sm font-bold flex items-center gap-10 justify-center'>
                    <NavLink to="/cpanel/productos" className="text-white">
                        Productos
                    </NavLink>
                    <NavLink to="/cpanel/empresas" className="text-white">
                        Empresas
                    </NavLink>
                    <NavLink to="/cpanel/departamentos" className="text-white">
                        Departamentos
                    </NavLink>
                    <NavLink to="/cpanel/personal" className="text-white">
                        Personal
                    </NavLink>
                    <NavLink to="/cpanel/usuarios" className="text-white">
                        Usuarios
                    </NavLink>
                    <NavLink to="/cpanel/ordenes" className="text-white">
                        Ordenes
                    </NavLink>
                    <NavLink to="/cpanel/resumen" className="text-white">
                        Cargas enviados
                    </NavLink>
                </nav>
            </div>
            

            <div className="mt-5">
                <Outlet />
            </div>
        </div>
    );
}