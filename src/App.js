import React, { useState, useEffect } from "react";
import "./App.css"; // Importaremos un CSS básico luego

// URL base de tu API (¡Asegúrate que tu backend esté corriendo!)
const API_URL = "http://ec2-98-81-150-1.compute-1.amazonaws.com:8080/api";

function App() {
  // --- Estados para guardar los datos ---
  const [clientes, setClientes] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  // --- Estados para los formularios ---
  // Cliente Nuevo
  const [newClientRut, setNewClientRut] = useState("");
  const [newClientDv, setNewClientDv] = useState("");
  const [newClientNombre, setNewClientNombre] = useState("");
  const [newClientPaterno, setNewClientPaterno] = useState("");
  const [newClientMaterno, setNewClientMaterno] = useState("");
  const [newClientDireccion, setNewClientDireccion] = useState("");
  const [newClientEstCivil, setNewClientEstCivil] = useState(1); // Default Soltero
  const [newClientFono, setNewClientFono] = useState("");
  const [newClientCelular, setNewClientCelular] = useState("");
  const [newClientRenta, setNewClientRenta] = useState("");

  // Actualizar Arriendo
  const [updatePropId, setUpdatePropId] = useState("");
  const [updatePropValor, setUpdatePropValor] = useState("");

  // Actualizar Sueldo
  const [updateEmpId, setUpdateEmpId] = useState("");
  const [updateEmpSueldo, setUpdateEmpSueldo] = useState("");

  // --- Función para obtener todos los Clientes ---
  const fetchClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes`);
      if (!response.ok) throw new Error("Error al obtener clientes");
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // --- Función para obtener todas las Propiedades ---
  const fetchPropiedades = async () => {
    try {
      const response = await fetch(`${API_URL}/propiedades`);
      if (!response.ok) throw new Error("Error al obtener propiedades");
      const data = await response.json();
      setPropiedades(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const response = await fetch(`${API_URL}/empleados`); // <-- Llama al nuevo endpoint
      if (!response.ok) throw new Error("Error al obtener empleados");
      const data = await response.json();
      setEmpleados(data); // <-- Guarda en el nuevo estado
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // --- useEffect: Se ejecuta una vez al cargar la página ---
  useEffect(() => {
    fetchClientes();
    fetchPropiedades();
    fetchEmpleados();
  }, []); // El array vacío asegura que solo se ejecute al inicio

  // --- Manejadores de Eventos (Handlers) ---

  const handleAddClient = async (event) => {
    event.preventDefault(); // Evita que la página se recargue
    const nuevoCliente = {
      numRutCli: parseInt(newClientRut), // Asegúrate que los números sean números
      dvRutCli: newClientDv,
      apPaternoCli: newClientPaterno,
      apMaternoCli: newClientMaterno,
      nombreCli: newClientNombre,
      direccionCli: newClientDireccion,
      idEstCivil: parseInt(newClientEstCivil),
      fonoFijoCli: parseInt(newClientFono) || null, // Convierte a número o null si está vacío
      celularCli: parseInt(newClientCelular) || null,
      rentaCli: parseInt(newClientRenta),
    };

    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente),
      });

      const responseText = await response.text(); // Leemos como texto primero
      if (!response.ok) {
        // Si el backend envió un error (ej. ORA-...), lo mostramos
        throw new Error(`Error ${response.status}: ${responseText}`);
      }

      alert(responseText); // Muestra "Cliente agregado"
      // Limpiar formulario y recargar lista
      setNewClientRut("");
      setNewClientDv("");
      setNewClientNombre("");
      setNewClientPaterno("");
      setNewClientMaterno("");
      setNewClientDireccion("");
      setNewClientEstCivil(1);
      setNewClientFono("");
      setNewClientCelular("");
      setNewClientRenta("");
      fetchClientes();
    } catch (error) {
      console.error(error);
      alert(error.message); // Muestra el error (ej. RUT duplicado)
    }
  };

  const handleDeleteClient = async (rut) => {
    if (!window.confirm(`¿Seguro que quieres borrar al cliente RUT ${rut}?`))
      return;

    try {
      const response = await fetch(`${API_URL}/clientes/${rut}`, {
        method: "DELETE",
      });
      const responseText = await response.text();
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${responseText}`);

      alert(responseText); // Muestra "Cliente borrado"
      fetchClientes(); // Recarga la lista
    } catch (error) {
      console.error(error);
      alert(error.message); // Muestra el error (ej. tiene arriendos)
    }
  };

  const handleUpdateArriendo = async (event) => {
    event.preventDefault();
    const id = parseInt(updatePropId);
    const nuevoValor = { valorArriendo: parseInt(updatePropValor) };

    try {
      const response = await fetch(`${API_URL}/propiedades/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoValor),
      });
      const responseText = await response.text();
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${responseText}`);

      alert(responseText);
      setUpdatePropId("");
      setUpdatePropValor("");
      fetchPropiedades(); // Recarga la lista de propiedades
    } catch (error) {
      console.error(error);
      alert(error.message); // Muestra error (ej. propiedad no encontrada)
    }
  };

  const handleUpdateSueldo = async (event) => {
    event.preventDefault();
    const rut = parseInt(updateEmpId);
    const nuevoSueldo = { nuevoSueldo: parseInt(updateEmpSueldo) };

    try {
      const response = await fetch(`${API_URL}/empleados/${rut}/sueldo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoSueldo),
      });
      const responseText = await response.text();
      if (!response.ok)
        throw new Error(`Error ${response.status}: ${responseText}`);

      alert(responseText);
      setUpdateEmpId("");
      fetchEmpleados();
      setUpdateEmpSueldo("");
      // No necesitamos recargar empleados aquí, solo mostrar el éxito/error
    } catch (error) {
      console.error(error);
      alert(error.message); // Muestra el error del TRIGGER si se activó
    }
  };

  // --- Renderizado del HTML (JSX) ---
  return (
    <div className="App">
      <h1>Gestión Inmobiliaria RAH</h1>

      {/* --- SECCIÓN CLIENTES --- */}
      <section>
        <h2>Clientes</h2>
        {/* Formulario para agregar */}
        <form onSubmit={handleAddClient} className="form-grid">
          <input
            type="number"
            value={newClientRut}
            onChange={(e) => setNewClientRut(e.target.value)}
            placeholder="RUT (sin DV)"
            required
          />
          <input
            type="text"
            value={newClientDv}
            onChange={(e) => setNewClientDv(e.target.value)}
            placeholder="DV"
            maxLength="1"
            required
          />
          <input
            type="text"
            value={newClientNombre}
            onChange={(e) => setNewClientNombre(e.target.value)}
            placeholder="Nombres"
            required
          />
          <input
            type="text"
            value={newClientPaterno}
            onChange={(e) => setNewClientPaterno(e.target.value)}
            placeholder="Apellido Paterno"
            required
          />
          <input
            type="text"
            value={newClientMaterno}
            onChange={(e) => setNewClientMaterno(e.target.value)}
            placeholder="Apellido Materno"
            required
          />
          <input
            type="text"
            value={newClientDireccion}
            onChange={(e) => setNewClientDireccion(e.target.value)}
            placeholder="Dirección"
            required
          />
          <select
            value={newClientEstCivil}
            onChange={(e) => setNewClientEstCivil(e.target.value)}
          >
            <option value="1">Soltero</option>
            <option value="2">Casado</option>
            <option value="3">Separado</option>
            <option value="4">Divorciado</option>
            <option value="5">Viudo</option>
          </select>
          <input
            type="number"
            value={newClientFono}
            onChange={(e) => setNewClientFono(e.target.value)}
            placeholder="Fono Fijo"
          />
          <input
            type="number"
            value={newClientCelular}
            onChange={(e) => setNewClientCelular(e.target.value)}
            placeholder="Celular"
          />
          <input
            type="number"
            value={newClientRenta}
            onChange={(e) => setNewClientRenta(e.target.value)}
            placeholder="Renta"
            required
          />
          <button type="submit">Agregar Cliente</button>
        </form>

        {/* Tabla de clientes */}
        <table>
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Renta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cli) => (
              <tr key={cli.numRutCli}>
                <td>
                  {cli.numRutCli}-{cli.dvRutCli}
                </td>
                <td>
                  {cli.nombreCli} {cli.apPaternoCli} {cli.apMaternoCli}
                </td>
                <td>{cli.direccionCli}</td>
                <td>${cli.rentaCli?.toLocaleString("es-CL")}</td>
                <td>
                  <button onClick={() => handleDeleteClient(cli.numRutCli)}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* --- SECCIÓN PROPIEDADES --- */}
      <section>
        <h2>Propiedades</h2>
        {/* Formulario para actualizar arriendo */}
        <form onSubmit={handleUpdateArriendo}>
          <input
            type="number"
            value={updatePropId}
            onChange={(e) => setUpdatePropId(e.target.value)}
            placeholder="N° Propiedad"
            required
          />
          <input
            type="number"
            value={updatePropValor}
            onChange={(e) => setUpdatePropValor(e.target.value)}
            placeholder="Nuevo Valor Arriendo"
            required
          />
          <button type="submit">Actualizar Arriendo</button>
        </form>

        {/* Tabla de propiedades */}
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Dirección</th>
              <th>Valor Arriendo</th>
              <th>Gastos Comunes</th>
              <th>Dorms</th>
              <th>Baños</th>
              <th>¿Arrendada?</th>
            </tr>
          </thead>
          <tbody>
            {propiedades.map((prop) => (
              <tr key={prop.nroPropiedad}>
                <td>{prop.nroPropiedad}</td>
                <td>{prop.direccionPropiedad}</td>
                <td>${prop.valorArriendo?.toLocaleString("es-CL")}</td>
                <td>${prop.valorGastoComun?.toLocaleString("es-CL") || "-"}</td>
                <td>{prop.nroDormitorios || "-"}</td>
                <td>{prop.nroBanos || "-"}</td>
                {/* Usamos el valor de la función aquí */}
                <td>{prop.estaArrendada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* --- SECCIÓN EMPLEADOS (Solo para probar el Trigger) --- */}
      <section>
        <h2>Empleados (Actualizar Sueldo)</h2>
        <form onSubmit={handleUpdateSueldo}>
          <input
            type="number"
            value={updateEmpId}
            onChange={(e) => setUpdateEmpId(e.target.value)}
            placeholder="RUT Empleado (sin DV)"
            required
          />
          <input
            type="number"
            value={updateEmpSueldo}
            onChange={(e) => setUpdateEmpSueldo(e.target.value)}
            placeholder="Nuevo Sueldo"
            required
          />
          <button type="submit">Actualizar Sueldo</button>
        </form>
        <p>
          <em>
            (Prueba a ingresar un sueldo menor al actual para ver el error del
            Trigger)
          </em>
        </p>
        {/* Tabla de empleados - NUEVA TABLA */}
        <table>
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Sueldo Actual</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.numRutEmp}>
                <td>{emp.numRutEmp}</td>
                <td>
                  {emp.nombreEmp} {emp.apPaternoEmp} {emp.apMaternoEmp}
                </td>
                <td>${emp.sueldoEmp?.toLocaleString("es-CL")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
