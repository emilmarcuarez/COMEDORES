import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: '', precio: '', stock: '' });

  // Cargar productos al cargar el componente
  useEffect(() => {
    axiosInstance.get('/productos')
      .then((response) => setProductos(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Función para agregar un nuevo producto
  const agregarProducto = () => {
    axiosInstance.post('/productos', formulario)
      .then((response) => {
        const nuevoProducto = response.data;
        setProductos((productosPrevios) => [...productosPrevios, nuevoProducto]);
        setFormulario({ nombre: '', precio: '', stock: '' }); // Limpiar formulario
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className='w-3/4 m-auto'>
      <h2 className='text-blue-950 font-bold text-xl pb-2'>Gestión de Productos</h2>

      {/* Lista de productos */}
      <div>
        <div className=''>
          <div className='flex justify-between p-2 bg-blue-950 rounded'>
            <p className='text-white font-bold'>Nombre</p>
            <p className='text-white font-bold'>Precio</p>
            <p className='text-white font-bold'>Stock</p>
          </div>
        </div>
        <div>
          {productos.map((producto) => (
            <div className='flex justify-between bg-gray-200' key={producto.id}>
              <p className='p-2'>{producto.nombre || 'Nuevo Producto'}</p>
              <p className='p-2'>${producto.precio || '0'}</p>
              <p className='p-2'>{producto.stock || '0'}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Formulario para agregar un producto */}
      <h3 className='pt-5  text-blue-950'>Agregar Producto</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          agregarProducto();
        }}
        className='flex flex-col gap-5 pt-6'
      >
        <input
          type="text"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
          required
          className='p-2 border border-gray-300'
        />
        <input
          type="number"
          placeholder="Precio"
          value={formulario.precio}
          onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })}
          required
          className='p-2 border border-gray-300'
        />
        <input
          type="number"
          placeholder="Stock"
          value={formulario.stock}
          onChange={(e) => setFormulario({ ...formulario, stock: e.target.value })}
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
