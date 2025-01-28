const { con } = require("../../config/db");
const { userData } = require("../../lib/auth");

const getUser = async (req, res) => {
  const _user = await userData(req, res);
  if (_user) {
    await con.query(
      `select concat(COALESCE(vu.aut_us_nombres, ''),' ',COALESCE(vu.aut_us_paterno, ''),' ',COALESCE(vu.aut_us_materno, ''))nombres, vu.aut_id_usuario id_usuario
          from autenticacion.vw_usuarios vu 
          where vu.aut_us_rol in(SELECT id_rol 
          FROM autenticacion.rol r 
          where r.sistema in('CALIDAD','ALL'))
`,
      (err, result) => {
        if (err) {
          return res.json({
            title: "Error",
            icon: "error",
            text: err.message
          });
        }
        if (result.rowCount > 0) {
          return res.status(200).json({
            title: "Correcto",
            icon: "success",
            text: "Se listaron correctamente los usuarios",
            data: result.rows
          });
        } else {
          return res.status(200).json({
            title: "Información",
            icon: "info",
            text: "No se encontraron Datos",
            data: ""
          });
        }
      }
    );
  } else {
    return res.status(401).json({
      message: "jwt expired"
    });
  }
};
module.exports = {
  getUser
};
