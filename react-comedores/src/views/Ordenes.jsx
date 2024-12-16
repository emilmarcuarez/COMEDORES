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
    <div className='m-auto w-3/4'>

   
    <OrdenesList />

    <form onSubmit={handleSubmit}>
      <h1 className='text-blue-950 font-bold text-xl pb-2'>Crear Orden</h1>

      {/* Selección de empresa */}
      <label>
        Seleccionar Empresa:
        <select onChange={(e) => setSelectedEmpresa(e.target.value)} required>
          <option value="">Seleccione una empresa</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.descripcion} {/* Asegúrate de usar el campo correcto */}
            </option>
          ))}
        </select>
      </label>

      {/* Lista de productos con cantidades */}
      <h2>Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {productosConCantidad.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td> {/* Cambia según el atributo del precio */}
              <td>
                <input
                  type="number"
                  min="0"
                  value={producto.cantidad}
                  onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="submit">Crear Orden</button>
    </form>
    </div>
  );
}

export default CrearOrden;
