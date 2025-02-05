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


const userCuestionario = async (req, res) => {
  const _user = await userData(req, res);
  const { usu_id } = req.params;
  if (_user) {
    try {
      var consulta = await con.query(
        `SELECT row_number() over(order by vcf.cod_cuest) nro, a.rep_id, a.depto, a.mpio, vcf.ag_unico, vcf.ae_unico, vcf.cod_cuest, 
        vcf.empadronador, a.usu_asig_id, a.fecha_asignacion, a.fecha_reasignacion, ce.estado
        FROM (
            SELECT rep_id, depto, mpio, usu_asig_id, fecha_asignacion, fecha_reasignacion, estado_id, 
                  ROW_NUMBER() OVER (PARTITION BY rep_id ORDER BY id DESC) AS rn
            FROM calidad.cal_asignacion
            WHERE estado_id IN (2, 3)
        ) a
        inner join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = a.rep_id
        left join calidad.cal_estado ce on ce.id_estado = a.estado_id
        WHERE a.rn = 1 AND a.usu_asig_id = '${usu_id}' `);

      console.log(consulta.rows);

      return res.status(200).json({
        title: 'Correcto',
        icon: 'success',
        text: 'Se encontraron datos',
        data: consulta.rows
      })
    } catch (e) {
      return res.status(404).json({
        title: 'Error',
        icon: 'error',
        text: e.message
      });
    }
  } else {
    return res.status(401).json({
      title: 'Error',
      icon: 'error',
      text: 'No se encontro usuario valido',
      data: 'jwt expired'
    });
  }
};

const reasignar = async (req, res) => {
  const _user = await userData(req, res);
  const { usu_id, repIds } = req.body;
  const fechaActual = new Date();
  let day = fechaActual.getDate()
  let month = fechaActual.getMonth() + 1
  let year = fechaActual.getFullYear();
  const fecha = year + '-' + month + '-' + day
  let registros = 0
  if (_user) {
    try {
      for (let cuest of repIds) {
        if (cuest) {
          var consulta = await con.query(
            `SELECT *
            FROM calidad.cal_asignacion
            WHERE rep_id = '${cuest}' `);

          console.log(consulta.rows);
          if (consulta.rows.length > 0) {
            const fechaAsig = consulta.rows[0].fecha_asignacion
            let day2 = fechaAsig.getDate()
            let month2 = fechaAsig.getMonth() + 1
            let year2 = fechaAsig.getFullYear();
            const fechaAsignacion = year2 + '/' + month2 + '/' + day2

            var inserta = await con.query(`INSERT INTO calidad.cal_asignacion
            (cod_depto, depto, cod_mpio, mpio, rep_id, usu_asig_id, usu_ant_id, estado_id, usucre, fecha_asignacion, fecha_reasignacion)
            VALUES( '${consulta.rows[0].cod_depto}', '${consulta.rows[0].depto}', '${consulta.rows[0].cod_mpio}', '${consulta.rows[0].mpio}', ${cuest}, 
              ${usu_id}, ${consulta.rows[0].usu_asig_id}, 3, ${_user.id_usuario}, '${fechaAsignacion}', '${fecha}') `);
            if (inserta.rowCount > 0) {
              registros = +1;
            }
          }
        }
      }

      if (registros > 0) {
        return res.status(200).json({
          title: 'Correcto',
          icon: 'success',
          text: 'Se realizó la reasignación',
          data: registros
        })
      } else {
        return res.status(200).json({
          title: 'Incorrecto',
          icon: 'success',
          text: 'No se realizo la reasignacion',
          data: null
        })
      }
    } catch (e) {
      return res.status(404).json({
        title: 'Error',
        icon: 'error',
        text: e.message
      });
    }
  } else {
    return res.status(401).json({
      title: 'Error',
      icon: 'error',
      text: 'No se encontro usuario valido',
      data: 'jwt expired'
    });
  }
};



module.exports = {
  getUser,
  userCuestionario,
  reasignar
};
