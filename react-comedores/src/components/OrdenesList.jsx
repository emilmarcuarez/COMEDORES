import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const OrdenesList = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Función para obtener órdenes desde la API con o sin filtros
  const fetchOrdenes = (start = "", end = "") => {
    let url = "http://localhost:8000/api/ordenes";
    if (start || end) url += `?start_date=${start}&end_date=${end}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setOrdenes(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const handleSearch = () => {
    fetchOrdenes(startDate, endDate);
  };

  // Generar PDF de una orden individual
  const handleDownloadPDF = (orden) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204);
    doc.text(`Orden #${orden.id}`, 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Empresa: ${orden.empresa ? orden.empresa.descripcion : "N/A"}`, 14, 30);
    doc.text(`Fecha de Creación: ${new Date(orden.created_at).toLocaleString()}`, 14, 40);

    const productos = orden.productos.map((producto, index) => [
      index + 1,
      producto.producto.nombre,
      producto.cantidad,
    ]);

    doc.autoTable({
      startY: 50,
      head: [["#", "Producto", "Cantidad"]],
      body: productos,
      theme: "grid",
      styles: { halign: "center" },
      headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
    });

    doc.save(`orden_${orden.id}.pdf`);
  };

  // Generar PDF de resumen de órdenes
  const handleGenerateResumenPDF = () => {
    if (!startDate || !endDate) {
      console.error("Por favor seleccione un rango de fechas");
      return;
    }

    fetch(`http://localhost:8000/api/ordenes?start_date=${startDate}&end_date=${endDate}`)
      .then((response) => response.json())
      .then((ordenes) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(0, 102, 204);
        doc.text("Resumen de Órdenes", 14, 20);

        let totalDesayunos = 0;
        let totalAlmuerzos = 0;
        let totalCenas = 0;

        const tableBody = ordenes.map((orden) => {
          let desayunos = 0;
          let almuerzos = 0;
          let cenas = 0;

          orden.productos.forEach((producto) => {
            const cantidad = Number(producto.cantidad);
            if (producto.producto.id === 1) desayunos += cantidad;
            if (producto.producto.id === 2) almuerzos += cantidad;
            if (producto.producto.id === 3) cenas += cantidad;
          });

          totalDesayunos += desayunos;
          totalAlmuerzos += almuerzos;
          totalCenas += cenas;

          return [
            orden.empresa?.descripcion || "N/A",
            desayunos,
            almuerzos,
            cenas,
          ];
        });

        doc.autoTable({
          startY: 30,
          head: [["Empresa", "Desayunos", "Almuerzos", "Cenas"]],
          body: tableBody,
          theme: "grid",
          headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
          styles: { halign: "center" },
          alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 10,
          body: [
            [
              "Totales Generales",
              totalDesayunos,
              totalAlmuerzos,
              totalCenas,
            ],
          ],
          styles: { halign: "center", fontStyle: "bold" },
          tableLineColor: [0, 102, 204],
          tableLineWidth: 0.1,
          headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
          columnStyles: {
            0: { fillColor: [220, 220, 220] },
          },
        });

        doc.save("resumen_ordenes.pdf");
      })
      .catch((error) => console.error("Error al generar PDF de resumen:", error));
  };

  return (
    <div>
      <h2 className="text-blue-950 font-bold text-xl pb-2">Lista de Órdenes</h2>
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
        <button
          onClick={handleGenerateResumenPDF}
          className="bg-red-600 text-white p-2 rounded ml-2"
        >
          Generar Resumen PDF
        </button>
      </div>

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
                  {orden.empresa ? orden.empresa.descripcion : "N/A"}
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
