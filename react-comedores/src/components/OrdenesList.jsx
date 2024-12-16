import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrdenesList = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Función para obtener órdenes desde la API con o sin filtros
  const fetchOrdenes = (start = '', end = '') => {
    let url = 'http://localhost:8000/api/ordenes';

    // Agregar filtros de fechas si están presentes
    if (start || end) {
      url += `?start_date=${start}&end_date=${end}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => setOrdenes(data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  // Cargar todas las órdenes inicialmente
  useEffect(() => {
    fetchOrdenes();
  }, []);

  // Manejar el evento de búsqueda por rango de fechas
  const handleSearch = () => {
    fetchOrdenes(startDate, endDate);
  };

  const handleDownloadPDF = (orden) => {
    if (!orden.productos || orden.productos.length === 0) {
      console.error('No hay productos para mostrar en el PDF');
      return;
    }

    const doc = new jsPDF();

    // Título principal
    doc.setFontSize(18);
    doc.text(`Orden #${orden.id}`, 14, 20);

    // Detalles de la orden
    doc.setFontSize(12);
    doc.text(`Empresa: ${orden.empresa ? orden.empresa.descripcion : 'N/A'}`, 14, 30);
    doc.text(`Fecha de Creación: ${new Date(orden.created_at).toLocaleString()}`, 14, 50);

    // Tabla de productos asociados
    const productos = orden.productos.map((producto, index) => [
      index + 1,
      producto.producto.nombre, // Nombre del producto
      producto.cantidad, // Cantidad
    ]);

    doc.autoTable({
      startY: 60,
      head: [['#', 'Producto', 'Cantidad']],
      body: productos,
      theme: 'grid',
    });

    // Guardar el archivo
    doc.save(`orden_${orden.id}.pdf`);
  };

  return (
    <div className="m-auto w-3/4">
      <h2 className="text-blue-950 font-bold text-xl pb-2">Lista de Órdenes</h2>

      {/* Filtros por rango de fechas */}
      <div className="mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded ml-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-950 text-white p-2 rounded ml-2"
        >
          Buscar
        </button>
      </div>

      {/* Tabla de órdenes */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-blue-950 text-white">
              <th className="p-2 text-center font-bold">ID</th>
              <th className="p-2 text-center font-bold">Empresa</th>
              <th className="p-2 text-center font-bold">Fecha Creación</th>
              <th className="p-2 text-center font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr className="bg-gray-200 border-t" key={orden.id}>
                <td className="p-2 text-center">{orden.id}</td>
                <td className="p-2 text-center">
                  {orden.empresa ? orden.empresa.descripcion : 'N/A'}
                </td>
                <td className="p-2 text-center">
                  {new Date(orden.created_at).toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDownloadPDF(orden)}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Descargar PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdenesList;
