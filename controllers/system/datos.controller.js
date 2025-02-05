const { con } = require("../../config/db");

const consultaDatos = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const query = `
      SELECT asi.depto, asi.mpio, rep.rep_ae, rep.rep_folio_upa, asi.rep_id, asi.estado_id, asi.usu_asig_id
      FROM calidad.cal_asignacion asi
      INNER JOIN cuestionarios.apk_replicas rep ON asi.rep_id = rep.rep_id
      WHERE asi.usu_asig_id = $1;
    `;
    const values = [661]; // Parámetro para la consulta

    const result = await con.query(query, values);

    // Devuelve los resultados en formato JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
};

module.exports = consultaDatos; // Exporta la función del controlador