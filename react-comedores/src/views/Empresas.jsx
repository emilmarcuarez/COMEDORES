import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({ descripcion: '', ubicacion: '', rif: '' });

  useEffect(() => {
    // Obtener empresas
    axiosInstance.get('/empresas')
      .then((response) => setEmpresas(response.data))
      .catch((error) => console.error('Error al obtener empresas:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const agregarEmpresa = () => {
    axiosInstance.post('/empresas', form)
      .then((response) => {
        setEmpresas([...empresas, response.data.empresa]);
        setForm({ descripcion: '', ubicacion: '', rif: '' }); // Limpiar el formulario
      })
      .catch((error) => console.error('Error al agregar empresa:', error));
  };

  return (
    <div className='m-auto w-3/4'>
      <h2 className='text-blue-950 font-bold text-xl pb-2'>Gestión de Empresas</h2>

      <div>
        <div className=''>
          <div className='flex justify-between p-2 bg-blue-950 rounded'>
            <p className='text-white font-bold'>Descripcion</p>
            <p className='text-white font-bold'>Ubicacion</p>
            <p className='text-white font-bold'>RIF</p>
          </div>
        </div>
        <div>
        {empresas.map((empresa) => (
            <div className='flex justify-between bg-gray-200' key={empresa.id}>
              <p className='p-2'>{empresa.descripcion || 'Nuevo Empresa'}</p>
              <p className='p-2'>{empresa.ubicacion || '0'}</p>
              <p className='p-2'>{empresa.rif || '0'}</p>
            </div>
          ))}
        </div>
      </div>


      <h3 className='pt-5  text-blue-950'>Agregar Empresa</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          agregarEmpresa();
        }}
        className='flex flex-col gap-5 pt-6'
     >
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
            className='p-2 border border-gray-300'
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
          required
            className='p-2 border border-gray-300'
        />
        <input
          type="text"
          name="rif"
          placeholder="RIF"
          value={form.rif}
          onChange={handleChange}
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
