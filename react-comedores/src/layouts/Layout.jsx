import { Outlet } from 'react-router-dom';
import Modal from 'react-modal';
import Sidebar from '../components/Sidebar';
import Resumen from '../components/Resumen';
import useQuiosco from '../hooks/useQuiosco';
import { useEffect, useState } from 'react';

// Estilos personalizados para el modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Configurar Modal
Modal.setAppElement('#root');

// Función para determinar el producto según el horario actual
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

export default function Layout() {
  const { modal, handleClickModal } = useQuiosco();
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // Función para agregar un producto al resumen
  const agregarProducto = (producto) => {
    setProductosSeleccionados((prevProductos) => {
      const existe = prevProductos.find((p) => p.id === producto.id);

      if (existe) {
        // Si ya existe, incrementa la cantidad
        return prevProductos.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad }
            : p
        );
      } else {
        // Si no existe, lo agrega con cantidad 1
        return [...prevProductos, { ...producto, cantidad: 1 }];
      }
    });
  };

  // Inicializa el producto según la hora actual
  useEffect(() => {
    const producto = obtenerProductosPorHorario();
    if (producto) {
      agregarProducto(producto);
    }
  }, []);

  // Actualiza el producto dinámicamente cada minuto
  useEffect(() => {
    const intervalo = setInterval(() => {
      const producto = obtenerProductosPorHorario();
      if (producto) {
        agregarProducto(producto);
      }
    }, 60000); // Verifica cada minuto

    return () => clearInterval(intervalo); // Limpia el intervalo al desmontar
  }, []);

  return (
    <>
      <div className="md:flex">
        {/* Pasamos setPersonaSeleccionada a Sidebar */}
        <Sidebar setPersonaSeleccionada={setPersonaSeleccionada} />

        <main className="flex-1 h-screen overflow-y-scroll ">
          <Outlet context={{ setProductosSeleccionados }} />
        </main>

        {/* Resumen muestra la persona y productos seleccionados */}
        <Resumen
          personaSeleccionada={personaSeleccionada} // Pasamos personaSeleccionada
          setPersonaSeleccionada={setPersonaSeleccionada} // Pasamos setPersonaSeleccionada
          productosSeleccionados={productosSeleccionados}
          setProductosSeleccionados={setProductosSeleccionados}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={modal} style={customStyles}>
        <button onClick={handleClickModal}>Cerrar</button>
      </Modal>
    </>
  );
}
