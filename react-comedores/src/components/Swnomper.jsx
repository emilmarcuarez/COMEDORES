import { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance'; // Importa la instancia de Axios

const Swnomper = () => {
  const [datos, setDatos] = useState([]); // Estado para almacenar los datos

  useEffect(() => {
    axiosInstance
      .get('swnomper') // La URL ya está configurada en la baseURL, solo agregamos la ruta
      .then(response => setDatos(response.data)) // Guardamos los datos en el estado
      .catch(error => console.error('Error al obtener datos:', error)); // Manejamos errores
  }, []);

  return (
    <div>
      <h1>Listado de Cédulas</h1>
      <ul>
        {datos.map((item, index) => (
          // Accedemos a la propiedad 'CEDULA' del objeto y la mostramos
          <li key={index}>
            {item.CEDULA} - {item.APENOM}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Swnomper;

