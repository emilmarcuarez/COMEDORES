import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { jsPDF } from 'jspdf';

export default function Resumen() {
  const [resumen, setResumen] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Obtener productos
    axiosInstance.get('/productos')
      .then((response) => {
        console.log('Productos cargados:', response.data);  // Depuración
        setProductos(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = () => {
    // Obtener resúmenes filtrados por fecha
    axiosInstance.get('/resumen', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    })
    .then((response) => setResumen(response.data))
    .catch((error) => console.error(error));
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
  
    // Título del PDF
    doc.setFontSize(18);
    doc.text('Resumen de Productos', 10, 10);
    doc.setFontSize(12);
  
    // Establecer los encabezados de la tabla
    const headers = ['Tipo', 'Producto', 'Cantidad', 'Referencia'];  // Añadir columna de referencia
    const data = resumen.map((resu) => {
      // Verificar que el producto_id existe y se puede encontrar en el array productos
      const producto = productos.find(prod => prod.nombre === resu.producto_nombre);
      const productoNombre = producto ? producto.nombre : 'Producto no encontrado';
      return [resu.tipo || 'Sin Tipo', productoNombre, resu.cantidad || '0', resu.referencia || 'No Disponible'];  // Incluir referencia
    });
  
    // Configuración del formato de la tabla
    const margin = 10;
    const rowHeight = 10;
    const tableWidth = doc.internal.pageSize.width - 2 * margin;
    const columnWidths = [40, 70, 30, 50];  // Anchos ajustados de las columnas
  
    // Encabezados de la tabla
    doc.setFont('helvetica', 'bold');
    headers.forEach((header, i) => {
      const xPos = margin + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.text(header, xPos, 20);
    });
  
    // Dibujar línea de separación después del encabezado
    doc.setLineWidth(0.5);
    doc.line(margin, 22, margin + tableWidth, 22);
  
    // Insertar filas de la tabla
    let yPosition = 25;  // Comienza debajo del encabezado
    data.forEach((row) => {
      doc.setFont('helvetica', 'normal');
      row.forEach((cell, i) => {
        const xPos = margin + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        doc.rect(xPos, yPosition, columnWidths[i], rowHeight); // Dibujar celdas
        doc.text(cell, xPos + 2, yPosition + 6); // Ajuste del texto dentro de la celda
      });
      yPosition += rowHeight;  // Avanzar a la siguiente fila
    });
  
    // Línea final al final de la tabla
    doc.line(margin, yPosition, margin + tableWidth, yPosition);
  
    // Guardar el archivo PDF
    doc.save('resumen.pdf');
  };
  
  
  

  return (
    <div className="m-auto w-3/4">
    <h2 className="text-blue-950 font-bold text-xl pb-2">Gestión de Ordenes Enviadas</h2>
  
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
  
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-blue-950 text-white">
            <th className="p-2 text-center font-bold">Tipo</th>
            <th className="p-2 text-center font-bold">Producto</th>
            <th className="p-2 text-center font-bold">Cantidad</th>
            <th className="p-2 text-center font-bold">Referencia</th>
          </tr>
        </thead>
        <tbody>
          {resumen.map((resu) => {
            // Verificar que el producto_id existe y se puede encontrar en el array productos
            const producto = productos.find(prod => prod.nombre === resu.producto_nombre);
            const productoNombre = producto ? producto.nombre : 'Producto no encontrado';
  
            return (
              <tr className="bg-gray-200 border-t" key={resu.id}>
                <td className="p-2 text-center">{resu.tipo || 'Sin Tipo'}</td>
                <td className="p-2 text-center">{productoNombre}</td>
                <td className="p-2 text-center">{resu.cantidad || '0'}</td>
                <td className="p-2 text-center">{resu.referencia || 'No Disponible'}</td> {/* Mostrar referencia */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  
    <button 
      onClick={handleGeneratePDF} 
      className="bg-green-500 text-white p-2 rounded mt-4"
    >
      Generar PDF
    </button>
  </div>
  
  );
}
