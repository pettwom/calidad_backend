/* eslint-disable no-unused-vars */
const { con, con_mon } = require("../../config/db");
const { userData } = require("../../lib/auth");
const getDepto = async (req, res) => {
  await con.query(
    `select distinct depto, cod_depto
from autenticacion.vw_calidad_filtro vcf 
order by 2`,
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
          text: "Se listo correctamente",
          data: result.rows
        });
      } else {
        return res.status(200).json({
          title: "Información",
          icon: "info",
          text: "No se encontraron datos, verique nuevamente!!",
          data: false
        });
      }
    }
  );
};
const getMpio = async (req, res) => {
  var id_depto = req.params.depto;
  await con_mon.query(
    `
        select distinct vcf.depto, vcf.cod_depto, vcf.mpio, vcf.cod_municipio 
        from autenticacion.vw_calidad_filtro vcf 
        where cod_depto = '${id_depto}'`,
    (err, result) => {
      console.log(`
        select distinct vcf.depto, vcf.cod_depto, vcf.mpio, vcf.cod_municipio 
        from autenticacion.vw_calidad_filtro vcf 
        where cod_depto = '${id_depto}'`);

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
          text: "Se listo correctamente",
          data: result.rows
        });
      } else {
        return res.status(200).json({
          title: "Información",
          icon: "info",
          text: "No se encontraron datos, verique nuevamente!!",
          data: false
        });
      }
    }
  );
};
const getAg = async (req, res) => {
  // console.log(req.params);
  var id_depto = req.params.depto;
  var id_mpio = req.params.mpio;

  await con_mon.query(
    `
        select distinct vcf.depto, vcf.cod_depto, vcf.mpio, vcf.cod_municipio, vcf.ag_unico
        from autenticacion.vw_calidad_filtro vcf 
        where cod_depto = '${id_depto}' and cod_municipio = '${id_mpio}'`,
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
          text: "Se listo correctamente",
          data: result.rows
        });
      } else {
        return res.status(200).json({
          title: "Información",
          icon: "info",
          text: "No se encontraron datos, verique nuevamente!!",
          data: false
        });
      }
    }
  );
};
const getAe = async (req, res) => {
  // console.log(req.params);
  var id_depto = req.params.depto;
  var id_mpio = req.params.mpio;
  var id_ag = req.params.ag;

  await con_mon.query(
    `
        select distinct vcf.depto, vcf.cod_depto, vcf.mpio, vcf.cod_municipio, vcf.ag_unico, vcf.ae_unico
        from autenticacion.vw_calidad_filtro vcf 
        where cod_depto = '${id_depto}' and cod_municipio = '${id_mpio}' and ag_unico = '${id_ag}'`,
    (err, result) => {
      if (err) {
        return res.json({
          title: "Error",
          icon: "error",
          text: err.message
        });
      }
      // console.log(result.rows);

      if (result.rowCount > 0) {
        return res.status(200).json({
          title: "Correcto",
          icon: "success",
          text: "Se listo correctamente",
          data: result.rows
        });
      } else {
        return res.status(200).json({
          title: "Información",
          icon: "info",
          text: "No se encontraron datos, verique nuevamente!!",
          data: false
        });
      }
    }
  );
};

const getEmp = async (req, res) => {
  console.log(req.params);

  var depto = req.params.depto;
  var mpio = req.params.mpio;
  var ag = req.params.ag;
  var ae = req.params.ae;
  var query = `select distinct cod_empadronador, empadronador from autenticacion.vw_calidad_filtro vcf where `;
  query += depto != "null" ? ` cod_depto = '${depto}' ` : "";
  query += mpio != "null" ? ` and cod_municipio = '${mpio}' ` : "";
  query += ag != "null" ? ` and ag_unico = '${ag}' ` : "";
  query += ae != "null" ? ` and ae_unico = '${ae}' ` : "";

  con_mon.query(query, (err, result) => {
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
        text: "Se listo correctamente",
        data: result.rows
      });
    } else {
      return res.status(200).json({
        title: "Información",
        icon: "info",
        text: "No se encontraron datos, verique nuevamente!!",
        data: false
      });
    }
  });
};

const getListado = async (req, res) => {
  var depto = req.params.depto;
  var mpio = req.params.mpio;
  var ag = req.params.ag;
  var ae = req.params.ae;
  var emp = req.params.emp;
  var query = `select row_number() over(order by a.cod_cuest) nro, a.* from(select distinct * from autenticacion.vw_calidad_filtro vcf where `;
  // console.log(depto, mpio, ag, ae, emp);

  query += depto != "null" ? ` cod_depto = '${depto}' ` : "";
  query += mpio != "null" ? ` and cod_municipio = '${mpio}' ` : "";
  query += ag != "null" ? ` and ag_unico = '${ag}' ` : "";
  query += ae != "null" ? ` and ae_unico = '${ae}' ` : "";
  query += emp != "null" ? ` and cod_empadronador = '${emp}' ` : "";
  query += `)a`;
  console.log(query)
  con_mon.query(query, (  err, result) => {
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
        text: "Se listo correctamente",
        data: result.rows
      });
    }
  });
};
const migrarDatos = async (req, res, next) => {
  await con.query(`select cuestionarios.fn_migrar_cuestionarios()`, (err, result) => {
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
        text: "Se listo correctamente",
        data: result.rows
      });
    }
  });
};
const getValidar = async (req, res, next) => {
  await con.query(
    `select ao.obs_observacion, ao.estado_id from cuestionarios.apk_observaciones ao where rep_id = ${req.params.ids}`,
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
          text: "Se listo correctamente",
          data: result.rows
        });
      }
    }
  );
};
const saveValidar = async (req, res) => {
  console.log(req.body);

  let _user = await userData(req, res);
  var tipo = req.body.tipo == "val" ? 8 : 4;
  var ids = req.body.ids;
  var data = req.body.dato;
  var categoria = req.body.categoria;
  try {
    console.log(`SELECT count(1) cant  from cuestionarios.apk_observaciones co where rep_id = ${ids} and id_tipo = ${tipo}`);
    var verificar = await con.query(
      `SELECT count(1) cant  from cuestionarios.apk_observaciones co where rep_id = ${ids} and id_tipo = ${tipo}`
    );
    console.log(verificar.rows[0].cant);
    if (verificar.rows[0].cant == 0) {
      await con.query(
        `
            INSERT INTO "cuestionarios"."apk_observaciones" ("rep_id", "observacion", "estado_id", "fecha_registro", "usucre", "id_tipo") 
            VALUES (${ids}, '${data}', '${tipo}', current_timestamp, ${_user.id_usuario} , ${categoria});`,

        (err, result) => {
          if (err) {
            if (!res.status(401)) {
              return res.json({
                title: "Error",
                icon: "error",
                text: err.message
              });
            }
          }
          if (result.rowCount > 0) {
            return res.status(200).json({
              title: "Correcto",
              icon: "success",
              text: "Se Valido correctamente",
              data: result.rows
            });
          }
        }
      );
    } else {
      await con.query(
        `
                update cuestionarios.apk_observaciones 
                set observacion = '${data}', 
                estado_id = ${tipo},
                fecha_registro=current_timestamp, 
                usucre = ${_user.id_usuario} 
                where rep_id = ${ids} and estado_id = ${tipo}`,
        (err, result) => {
          if (err) {
            if (!res.status(401)) {
              return res.json({
                title: "Error",
                icon: "error",
                text: err.message
              });
            }
          }
          if (result.rowCount > 0) {
            return res.status(200).json({
              title: "Correcto",
              icon: "success",
              text: "Se Valido correctamente",
              data: result.rows
            });
          }
        }
      );
    }
  } catch (error) {
    return res.status(404).json({
      title: "Error",
      icon: "error",
      text: error.message
    });
  }
};
module.exports = {
  getDepto,
  getMpio,
  getAg,
  getAe,
  getEmp,
  getListado,
  migrarDatos,
  getValidar,
  saveValidar
};
