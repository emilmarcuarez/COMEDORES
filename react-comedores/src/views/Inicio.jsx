import { useOutletContext } from 'react-router-dom';
import ListaProductos from '../components/Producto';

export default function Inicio() {
  const { setProductosSeleccionados } = useOutletContext(); // Obtenemos la función del Layout

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-950 min-h-screen p-6">
      <h1 className="text-4xl text-white">Menu</h1>
      <p className="text-2xl text-white">
        Selecciona la comida
      </p>
      {/* Pasamos setProductosSeleccionados a ListaProductos */}
      <ListaProductos setProductosSeleccionados={setProductosSeleccionados} />
    </div>
  );
}
