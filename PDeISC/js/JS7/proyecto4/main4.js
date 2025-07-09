import express from "express";

const app = express();
const PUERTO = 8081; 

app.use(express.static("public"));

// ruta API para obtener los datos de los alumnos
app.get("/api/alumnos_configurados", (req, res) => {
  // lista de alumnos
  const alumnos = [
    { id: 1, nombre: "Paulo", edad: 18, curso: "7mo", turno: "noche", especia: "Informática" },
    { id: 2, nombre: "Kvicha", edad: 18, curso: "7mo", turno: "noche", especia: "Electrónica"},
    { id: 3, nombre: "Fracisco", edad: 16, curso: "4to", turno: "tarde", especia: "Mecatrónica" },
    { id: 4, nombre: "Gonzalo", edad: 16, curso: "5to", turno: "tarde", especia: "Construcciones" },
    { id: 5, nombre: "Kara", edad: 17, curso: "6to", turno: "mañana", especia: "Automotores" },
  ];
  res.json(alumnos); // envía la lista de como respuesta JSON
});

app.listen(PUERTO, () => {
  console.log(`http://localhost:${PUERTO}`);
});