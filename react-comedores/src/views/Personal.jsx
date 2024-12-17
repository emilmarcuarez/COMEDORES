import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export default function Personal() {
  const [personal, setPersonal] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    sexo: 'M',
    cedula_rif: '',
    departamento_id: '',
    empresa_id: '',
  });

  useEffect(() => {
    axiosInstance.get('/personal')
      .then(response => setPersonal(response.data))
      .catch(error => console.error(error));

    axiosInstance.get('/departamentos')
      .then(response => setDepartamentos(response.data))
      .catch(error => console.error(error));

    axiosInstance.get('/empresas')
      .then(response => setEmpresas(response.data))
      .catch(error => console.error(error));
  }, []);

  const agregarPersonal = () => {
    axiosInstance.post('/personal', formulario)
      .then(response => setPersonal([...personal, response.data]))
      .catch(error => console.error(error));
  };

  return (
    <div className='m-auto w-3/4 pb-10'>
      <h2 className='text-blue-950 font-bold text-xl pb-2'>Gestión de Personal</h2>
    

      <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
      <thead>
          <tr className="bg-blue-950 text-white">
            <th className="p-2 text-center font-bold">Nombre</th>
            <th className="p-2 text-center font-bold">Apellido</th>
            <th className="p-2 text-center font-bold">Cedula / Rif</th>
            <th className="p-2 text-center font-bold">Departamento</th>
            <th className="p-2 text-center font-bold">Empresa</th>
          </tr>
        
        </thead>
          <tbody>
          {personal.map((persona) => (
              <tr className="bg-gray-200 border-t"  key={personal.id}>
                <td className="p-2 text-center">{persona.nombre || 'Nuevo Personal'}</td>
                <td className="p-2 text-center">{persona.apellido || '0'}</td>
                <td className="p-2 text-center">{persona.cedula_rif || '0'}</td>
                <td className="p-2 text-center">{persona.departamento?.descripcion || '0'}</td>
                <td className="p-2 text-center">{persona.empresa?.descripcion || '0'}</td>
              </tr>
            ))}
         </tbody>
       </table>
 </div>
      <h3 className='pt-5  text-blue-950'>Agregar Personal</h3>
      <form onSubmit={e => {
        e.preventDefault();
        agregarPersonal();
      }}
      className='flex flex-col gap-5 pt-6'
      >
        <input
          type="text"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={e => setFormulario({ ...formulario, nombre: e.target.value })}
         className='p-2 border border-gray-300'
      />
        <input
          type="text"
          placeholder="Apellido"
          value={formulario.apellido}
          onChange={e => setFormulario({ ...formulario, apellido: e.target.value })}
         className='p-2 border border-gray-300'
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={formulario.telefono}
          onChange={e => setFormulario({ ...formulario, telefono: e.target.value })}
           className='p-2 border border-gray-300'
       />
        <input
          type="text"
          placeholder="Dirección"
          value={formulario.direccion}
          onChange={e => setFormulario({ ...formulario, direccion: e.target.value })}
         className='p-2 border border-gray-300'
       />
        <select
          value={formulario.sexo}
          onChange={e => setFormulario({ ...formulario, sexo: e.target.value })}
          className='p-2 border border-gray-300 bg-white'
        >
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        <input
          type="text"
          placeholder="Cédula o RIF"
          value={formulario.cedula_rif}
          onChange={e => setFormulario({ ...formulario, cedula_rif: e.target.value })}
          className='p-2 border border-gray-300'
     />
        <select
          value={formulario.departamento_id}
          onChange={e => setFormulario({ ...formulario, departamento_id: e.target.value })}
       className='p-2 border border-gray-300 bg-white'
       >
          <option value="">Seleccione un Departamento</option>
          {departamentos.map(dep => (
            <option key={dep.id} value={dep.id}>{dep.descripcion}</option>
          ))}
        </select>
        <select
          value={formulario.empresa_id}
          onChange={e => setFormulario({ ...formulario, empresa_id: e.target.value })}
          className='p-2 border border-gray-300 bg-white'
        >
          <option value="">Seleccione una Empresa</option>
          {empresas.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.descripcion}</option>
          ))}
        </select>
        <button type="submit"
         className='bg-blue-800 p-2 text-white rounded'
        >Agregar</button>
      </form>
    </div>
  );
}
