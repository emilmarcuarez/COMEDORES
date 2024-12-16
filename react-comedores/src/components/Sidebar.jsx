import PropTypes from 'prop-types';
import { IconSearch, IconColumnInsertLeft } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export default function Sidebar({ setPersonaSeleccionada }) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mensajeError, setMensajeError] = useState(''); // Mensaje de error

  useEffect(() => {
    // Obtener los departamentos al cargar el componente
    const obtenerDepartamentos = async () => {
      try {
        const response = await axiosInstance.get('/departamentos');
        setDepartamentos(response.data);
      } catch (error) {
        console.error('Error al obtener departamentos:', error);
      }
    };
    obtenerDepartamentos();
  }, []);

  const buscarPersona = async () => {
    setMensajeError(''); // Limpia cualquier error previo
    setResultados([]); // Limpia los resultados anteriores
  
    if (busqueda.trim().length < 3) {
      setMensajeError('Debe ingresar al menos 3 caracteres para buscar.');
      return;
    }
  
    try {
      const response = await axiosInstance.get(`/personal`, {
        params: { cedula_rif: busqueda.trim() }, // Envía el parámetro limpio al backend
      });
  
      const query = busqueda.trim().toLowerCase(); // Normaliza el texto de búsqueda
      const dataFiltrada = response.data.filter((persona) =>
        `${persona.cedula_rif}%%${persona.nombre}`.toLowerCase().includes(query)
      );
  
      if (dataFiltrada.length === 0) {
        setMensajeError('No se encontraron resultados para esta búsqueda.');
      } else {
        setResultados(dataFiltrada);
      }
    } catch (error) {
      console.error('Error al buscar persona:', error);
      setMensajeError('Ocurrió un error al buscar. Intente nuevamente.');
    }
  };
  

  const seleccionarPersona = (persona) => {
    setPersonaSeleccionada({ ...persona, tipo: 'persona' });
    setResultados([]);
    setBusqueda('');
    setShowModal(false);
  };

  const seleccionarDepartamento = (departamento) => {
    setPersonaSeleccionada({ ...departamento, tipo: 'departamento' });
    setShowModal(false);
  };

  const handleConfirmar = () => {
    if (!setPersonaSeleccionada) {
      alert('Por favor, selecciona una persona o un departamento.');
    }
  };

  return (
    <aside className="md:w-72">
      <div className="p-4">
        <img className="w-40" src="img/logo.png" alt="img-logo" />
      </div>

      {/* Barra de búsqueda */}
      <div className="px-5 flex gap-2">
        <input
          className="border-gray-500 rounded border-2 w-full p-1"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por cédula o parte de ella"
        />
        <button
          type="button"
          className="text-center bg-blue-600 p-2 rounded-full"
          onClick={buscarPersona}
        >
          <IconSearch stroke={2} color="white" width={15} height={15} />
        </button>
      </div>

      {/* Mensaje de error */}
      {mensajeError && (
        <div className="text-red-600 text-sm mt-2 px-5">{mensajeError}</div>
      )}

      {/* Resultados de búsqueda */}
      <div className="mt-3 px-5">
        {resultados.length > 0 && (
          <ul className="bg-white rounded shadow">
            {resultados.map((persona) => (
              <li
                key={persona.id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => seleccionarPersona(persona)}
              >
                {persona.cedula_rif} - {persona.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón de seleccionar departamento */}
      <div className="my-5 px-5">
        <button
          type="button"
          className="text-center bg-blue-800 w-full p-3 font-bold text-white truncate rounded"
          onClick={() => setShowModal(true)}
        >
          Seleccionar departamento
        </button>
      </div>

      {/* Modal para seleccionar departamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-96">
            <h2 className="text-xl mb-4">Seleccionar Departamento</h2>
            <div className="mb-4">
              <ul>
                {departamentos.map((departamento) => (
                  <li
                    key={departamento.id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => seleccionarDepartamento(departamento)}
                  >
                    {departamento.descripcion}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between">
              <button
                className="text-gray-500"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-800 text-white p-2 rounded"
                onClick={handleConfirmar}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón Captar */}
      <div className="mt-10 px-5">
        <button
          className="text-center bg-green-600 w-full p-3 font-bold text-white flex gap-2 rounded"
          type="button"
          onClick={handleConfirmar}
        >
          Captar
          <IconColumnInsertLeft stroke={2} />
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  setPersonaSeleccionada: PropTypes.func.isRequired,
};
