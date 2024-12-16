import PropTypes from 'prop-types';
import axios from 'axios';

export default function Resumen({
  personaSeleccionada,
  setPersonaSeleccionada,
  productosSeleccionados,
  setProductosSeleccionados,
}) {
  const eliminarProducto = (idProducto) => {
    setProductosSeleccionados((prevProductos) =>
      prevProductos.filter((producto) => producto.id !== idProducto)
    );
  };

  const obtenerProductosPorHorario = () => {
    const fechaActual = new Date();
    const hora = fechaActual.getHours();

    if (hora >= 5 && hora < 10) {
      return { id: 1, nombre: 'Desayuno', tipo: 'DESAYUNO' };
    } else if (hora >= 10 && hora < 15) {
      return { id: 2, nombre: 'Almuerzo', tipo: 'ALMUERZO' };
    } else if (hora >= 15 && hora <= 23) {
      return { id: 3, nombre: 'Cena', tipo: 'CENA' };
    } else {
      return null;
    }
  };

  const guardarResumen = async () => {
    if (!personaSeleccionada) {
        alert('Selecciona una persona o departamento primero.');
        return;
    }

    if (productosSeleccionados.length === 0) {
        alert('El resumen no tiene productos seleccionados.');
        return;
    }

    try {
        const response = await axios.post('/api/guardar-resumen', {
            personaSeleccionada,
            productosSeleccionados,
        });

        if (response.status === 201) {
            alert('Resumen guardado correctamente.');

            // Limpiar datos después de guardar
            setPersonaSeleccionada(null);
            setProductosSeleccionados([]);

            // Agregar automáticamente el producto del horario actual
            const productoHorario = obtenerProductosPorHorario();
            if (productoHorario) {
                setProductosSeleccionados([{ ...productoHorario, cantidad: 1 }]);
            }
        }
    } catch (error) {
        console.error(error);
        alert('Hubo un error al guardar el resumen: ' + (error.response?.data?.error || error.message));
    }
};


  return (
    <div className="w-72 p-4 bg-white">
      <h2 className="text-lg font-bold text-black">Resumen</h2>

      {personaSeleccionada ? (
        personaSeleccionada.tipo === 'persona' ? (
          <>
            <p className="text-gray-600">
              <strong>Cédula:</strong> {personaSeleccionada.cedula_rif}
            </p>
            <p className="text-gray-600">
              <strong>Nombre:</strong> {personaSeleccionada.nombre}
            </p>
            <p className="text-gray-600">
              <strong>Apellido:</strong> {personaSeleccionada.apellido}
            </p>
            <p className="text-gray-600">
              <strong>Sexo:</strong> {personaSeleccionada.sexo}
            </p>
            <p className="text-gray-600">
              <strong>Dirección:</strong> {personaSeleccionada.direccion}
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-600">
              <strong>Departamento:</strong> {personaSeleccionada.descripcion}
            </p>
          </>
        )
      ) : (
        <p className="text-gray-600">
          No hay persona ni departamento seleccionado
        </p>
      )}

      <h2 className="text-gray-800 font-bold text-xl pt-5">
        Productos seleccionados
      </h2>
      {productosSeleccionados.length > 0 ? (
        <ul>
          {productosSeleccionados.map((producto) => (
            <li
              key={producto.id}
              className="flex justify-between items-center mb-2 p-3 bg-gray-700 rounded"
            >
              <div>
                <p className="font-bold text-white">{producto.nombre}</p>
                <p className="text-white">
                  Cantidad:{' '}
                  <span className="font-semibold">{producto.cantidad}</span>
                </p>
              </div>
              <button
                onClick={() => eliminarProducto(producto.id)}
                className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos en el resumen.</p>
      )}

      {personaSeleccionada && productosSeleccionados.length > 0 && (
        <button
          onClick={guardarResumen}
          className="mt-4 w-full bg-green-500 text-white p-2 rounded"
        >
          Guardar Resumen
        </button>
      )}
    </div>
  );
}

Resumen.propTypes = {
  personaSeleccionada: PropTypes.shape({
    tipo: PropTypes.oneOf(['persona', 'departamento']),
    cedula_rif: PropTypes.string,
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string,
    sexo: PropTypes.string,
    direccion: PropTypes.string,
    descripcion: PropTypes.string,
  }),

  setPersonaSeleccionada: PropTypes.func.isRequired,
  productosSeleccionados: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      cantidad: PropTypes.number.isRequired,
    })
  ).isRequired,
  setProductosSeleccionados: PropTypes.func.isRequired,
};
