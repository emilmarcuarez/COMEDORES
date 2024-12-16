import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    // Obtener departamentos
    axiosInstance.get('/departamentos')
      .then((response) => setDepartamentos(response.data))
      .catch((error) => console.error('Error al obtener departamentos:', error));
  }, []);

  const agregarDepartamento = () => {
    axiosInstance.post('/departamentos', { descripcion })
      .then((response) => {
        setDepartamentos([...departamentos, response.data.departamento]);
        setDescripcion(''); // Limpiar el campo
      })
      .catch((error) => console.error('Error al agregar departamento:', error));
  };

  return (
    <div className='m-auto w-3/4'>
      <h2 className='text-blue-950 font-bold text-xl pb-2'>Gestión de Departamentos</h2>

      <div>
        <div className=''>
          <div className='flex justify-between p-2 bg-blue-950 rounded'>
            <p className='text-white font-bold'>Id</p>
            <p className='text-white font-bold'>Descripcion</p>
          </div>
        </div>
        <div>
        {departamentos.map((departamento) => (
            <div className='flex justify-between bg-gray-200' key={departamento.id}>
              <p className='p-2'>{departamento.id || '0'}</p>
              <p className='p-2'>{departamento.descripcion || '0'}</p>
            </div>
          ))}
        </div>
      </div>



      <h3 className='pt-5  text-blue-950'>Agregar Departamento</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          agregarDepartamento();
        }}
        className='flex flex-col gap-5 pt-6'  
      >
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
            className='p-2 border border-gray-300'
        />
        <button type="submit"
         className='bg-blue-800 p-2 text-white rounded'
        >Agregar</button>
      </form>
    </div>
  );
}
