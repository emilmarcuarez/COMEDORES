import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({ descripcion: "", ubicacion: "", rif: "" });

  useEffect(() => {
    // Obtener empresas
    axiosInstance
      .get("/empresas")
      .then((response) => setEmpresas(response.data))
      .catch((error) => console.error("Error al obtener empresas:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const agregarEmpresa = () => {
    axiosInstance
      .post("/empresas", form)
      .then((response) => {
        setEmpresas([...empresas, response.data.empresa]);
        setForm({ descripcion: "", ubicacion: "", rif: "" }); // Limpiar el formulario
      })
      .catch((error) => console.error("Error al agregar empresa:", error));
  };

  return (
    <div className="m-auto w-3/4">
      <h2 className="text-blue-950 font-bold text-xl pb-2">
        Gestión de Empresas
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-blue-950 text-white">
              <th className="p-2 text-center font-bold">Descripcion</th>
              <th className="p-2 text-center font-bold">Ubicacion</th>
              <th className="p-2 text-center font-bold">RIF</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr
               className="bg-gray-200 border-t"
                key={empresa.id}
              >
                <td className="p-2 text-center">{empresa.descripcion || "Nuevo Empresa"}</td>
                <td className="p-2 text-center">{empresa.ubicacion || "0"}</td>
                <td className="p-2 text-center">{empresa.rif || "0"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="pt-5  text-blue-950">Agregar Empresa</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          agregarEmpresa();
        }}
        className="flex flex-col gap-5 pt-6"
      >
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300"
        />
        <input
          type="text"
          name="ubicacion"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300"
        />
        <input
          type="text"
          name="rif"
          placeholder="RIF"
          value={form.rif}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300"
        />
        <button type="submit" className="bg-blue-800 p-2 text-white rounded">
          Agregar
        </button>
      </form>
    </div>
  );
}
