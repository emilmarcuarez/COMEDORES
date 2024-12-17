import { useEffect, useState } from "react";
import axios from "axios";
import OrdenesList from '../components/OrdenesList';
function CrearOrden() {
  const [empresas, setEmpresas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [productosConCantidad, setProductosConCantidad] = useState([]);

  // Obtener empresas y productos al cargar el componente
  useEffect(() => {
    axios.get("/api/empresas").then((response) => {
      setEmpresas(response.data);
    });

    axios.get("/api/productos").then((response) => {
      const productos = response.data.map((producto) => ({
        ...producto,
        cantidad: 0, // Inicializa la cantidad en 0 para todos los productos
      }));
      setProductos(productos);
      setProductosConCantidad(productos);
    });
  }, []);

  // Manejar cambios en la cantidad de los productos
  const handleCantidadChange = (id, cantidad) => {
    setProductosConCantidad((prev) =>
      prev.map((producto) =>
        producto.id === id ? { ...producto, cantidad: parseInt(cantidad) || 0 } : producto
      )
    );
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const productosSeleccionados = productosConCantidad
      .filter((producto) => producto.cantidad > 0) // Solo envía productos con cantidad mayor a 0
      .map((producto) => ({
        producto_id: producto.id,
        cantidad: producto.cantidad,
      }));

    axios
      .post("/api/ordenes", {
        empresa_id: selectedEmpresa,
        productos: productosSeleccionados,
      })
      .then((response) => {
        alert("Orden creada exitosamente");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='m-auto w-3/4 mb-20'>

   
    <OrdenesList />

    <form onSubmit={handleSubmit} className="pt-9">
      <h1 className='text-blue-950 font-bold text-xl pb-2'>Crear Orden</h1>

      {/* Selección de empresa */}
      <label className="pt-8">
        <p className='font-bold text-xl pb-2'>Seleccionar Empresa: </p>
        <select
        className="w-full p-1 border border-gray-600 rounded"
        onChange={(e) => setSelectedEmpresa(e.target.value)} required>
          <option value="">Seleccione una empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.descripcion} {/* Asegúrate de usar el campo correcto */}
            </option>
          ))}
        </select>
      </label>

      {/* Lista de productos con cantidades */}
      <h2 className="pt-5 pb-3">Productos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-blue-950 text-white">
              <th className="p-2 text-center font-bold">Producto</th>
              <th className="p-2 text-center font-bold">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {productosConCantidad.map((producto) => (
              <tr key={producto.id}>
                <td className="font-bold py-2">{producto.nombre}</td>
              
                <td>
                  <input
                  className="w-full text-center"
                    type="number"
                    min="0"
                    placeholder={producto.cantidad}
                    onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
      className="mt-5 p-2 w-full bg-gray-800 rounded text-white"
      type="submit">Crear Orden</button>
    </form>
    </div>
  );
}

export default CrearOrden;
