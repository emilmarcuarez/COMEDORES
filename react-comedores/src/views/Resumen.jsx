import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { jsPDF } from "jspdf";

export default function Resumen() {
  const [resumen, setResumen] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Obtener productos
    axiosInstance
      .get("/productos")
      .then((response) => setProductos(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = () => {
    // Obtener resúmenes filtrados por fecha
    axiosInstance
      .get("/resumen", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      })
      .then((response) => setResumen(response.data))
      .catch((error) => console.error(error));
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204);
    doc.text("Comidas entregadas", 14, 20);

    // Configuración de encabezados y datos
    const headers = ["Tipo", "Producto", "Cantidad", "Referencia"];
    const body = resumen.map((resu) => {
      const producto = productos.find(
        (prod) => prod.nombre === resu.producto_nombre
      );
      const productoNombre = producto ? producto.nombre : "Producto no encontrado";
      return [
        resu.tipo || "Sin Tipo",
        productoNombre,
        resu.cantidad || "0",
        resu.referencia || "No Disponible",
      ];
    });

    // Dibujar la tabla
    doc.autoTable({
      startY: 30,
      head: [headers],
      body: body,
      theme: "grid",
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { halign: "center", cellPadding: 2 },
    });

    // Guardar el archivo PDF
    doc.save("resumen.pdf");
  };

  return (
    <div className="m-auto w-3/4">
      <h2 className="text-blue-950 font-bold text-2xl pb-4">Gestión de Ordenes que han entregado</h2>

      {/* Filtros por rango de fechas */}
      <div className="mb-4 flex items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-950 text-white p-2 rounded hover:bg-blue-800"
        >
          Buscar
        </button>
      </div>

      {/* Tabla de resultados */}
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
              const producto = productos.find(
                (prod) => prod.nombre === resu.producto_nombre
              );
              const productoNombre = producto
                ? producto.nombre
                : "Producto no encontrado";

              return (
                <tr className="bg-gray-100 border-t" key={resu.id}>
                  <td className="p-2 text-center">{resu.tipo || "Sin Tipo"}</td>
                  <td className="p-2 text-center">{productoNombre}</td>
                  <td className="p-2 text-center">{resu.cantidad || "0"}</td>
                  <td className="p-2 text-center">
                    {resu.referencia || "No Disponible"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botón para generar PDF */}
      <button
        onClick={handleGeneratePDF}
        className="bg-green-600 text-white p-3 rounded mt-4 hover:bg-green-500"
      >
        Generar PDF
      </button>
    </div>
  );
}
