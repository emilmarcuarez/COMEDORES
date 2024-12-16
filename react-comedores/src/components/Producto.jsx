import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../services/axiosInstance';
import Modal from 'react-modal';

// Estilos personalizados para el modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',  // Bordes redondeados para el modal
    padding: '20px',  // Añadir espacio interno
    backgroundColor: '#f9f9f9',  // Fondo más claro
  },
};

Modal.setAppElement('#root');

const obtenerTipoComidaPorHora = () => {
  const fechaActual = new Date();
  const hora = fechaActual.getHours();

  if (hora >= 5 && hora < 10) {
    return { id: 1, nombre: 'Desayuno'};
  } else if (hora >= 10 && hora < 15) {
    return { id: 2, nombre: 'Almuerzo'};
  } else if (hora >= 15 && hora <= 23) {
    return { id: 3, nombre: 'Cena'};
  } else {
    return null;
  }
};

export default function ListaProductos({ setProductosSeleccionados }) {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    // Obtener el tipo de comida según la hora
     // Obtener el tipo de comida según la hora
     const tipoComida = obtenerTipoComidaPorHora();

     if (tipoComida) {
       // Realizamos la solicitud a la API para obtener los productos según el tipo de comida
       axiosInstance
         .get(`/productos/tipo/${tipoComida.id}`)  // Usamos el tipo de comida como parámetro
         .then((response) => {
           console.log(`Productos (${tipoComida.nombre}):`, response.data);  // Verifica los productos
           setProductos(response.data);
         })
         .catch((error) => {
           console.error('Error al obtener productos:', error);
         });
     }
  }, []);  // Se ejecuta solo una vez cuando el componente se monta

  const handleAbrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1); // Reseteamos la cantidad al abrir el modal
  };

  const handleCerrarModal = () => {
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const agregarProducto = () => {
    if (cantidad > 0 && productoSeleccionado) {
      const productoConCantidad = {
        ...productoSeleccionado,
        cantidad,
      };

      // Agregamos el producto al estado del padre
      setProductosSeleccionados((prevProductos) => {
        const productoExistente = prevProductos.find(
          (prod) => prod.id === productoConCantidad.id
        );

        // Si ya existe, actualizamos la cantidad
        if (productoExistente) {
          return prevProductos.map((prod) =>
            prod.id === productoConCantidad.id
              ? { ...prod, cantidad: prod.cantidad + cantidad }
              : prod
          );
        }

        // Si no existe, lo agregamos
        return [...prevProductos, productoConCantidad];
      });

      handleCerrarModal();
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-950 min-h-screen p-6">
      {productos.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <li
              key={producto.id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={producto.imagen || '/default-product.png'}
                  alt={producto.nombre}
                  className="w-24 h-24 object-cover rounded-lg mb-4"
                />
                <span className="font-bold text-lg text-gray-800">{producto.nombre}</span>
              </div>
              <button
                onClick={() => handleAbrirModal(producto)}
                className="bg-blue-500 text-white py-2 px-4 rounded-full text-xs mt-4 hover:bg-blue-600 transition-colors duration-200"
              >
                Agregar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white text-center mt-6">No hay productos registrados.</p>
      )}

      <Modal isOpen={productoSeleccionado !== null} style={customStyles}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ingresar cantidad</h2>
        <div>
          <p className="text-lg mb-2 text-gray-600">Producto: {productoSeleccionado?.nombre}</p>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="border p-3 w-full mb-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
          <div className="flex gap-4">
            <button
              onClick={agregarProducto}
              className="bg-blue-500 text-white py-2 px-4 w-full rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200"
            >
              Agregar Producto
            </button>
            <button
              onClick={handleCerrarModal}
              className="bg-red-500 text-white py-2 px-4 w-full rounded-lg text-sm hover:bg-red-600 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

ListaProductos.propTypes = {
  setProductosSeleccionados: PropTypes.func.isRequired,
};
