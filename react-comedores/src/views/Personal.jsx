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
    

    <div>
        <div className=''>
          <div className='flex justify-between p-2 bg-blue-950 rounded'>
            <p className='text-white font-bold'>Nombre</p>
            <p className='text-white font-bold'>Apellido</p>
            <p className='text-white font-bold'>Cedula / Rif</p>
            <p className='text-white font-bold'>Departamento</p>
            <p className='text-white font-bold'>Empresa</p>
          </div>
        </div>
        <div>
        {personal.map((persona) => (
            <div className='flex justify-between bg-gray-200' key={personal.id}>
              <p className='p-2'>{persona.nombre || 'Nuevo Personal'}</p>
              <p className='p-2'>{persona.apellido || '0'}</p>
              <p className='p-2'>{persona.cedula_rif || '0'}</p>
              <p className='p-2'>{persona.departamento?.descripcion || '0'}</p>
              <p className='p-2'>{persona.empresa?.descripcion || '0'}</p>
            </div>
          ))}
        </div>
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
