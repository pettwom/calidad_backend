const { con } = require("../../config/db");
const { userData } = require("../../lib/auth");

const listarCuestionarios = async (req, res) => {
  var query = `select row_number()over(order by vcf.depto)nro, vcf.depto, vcf.mpio, vcf.comunidad, vcf.ag_unico, vcf.ae_unico, vcf.cod_cuest, 
              vcf.cue_titulo, cod_empadronador, empadronador,vcf.estado_rep, vcf.descripcion, vcf.rep_id, ca.id
              from autenticacion.vw_calidad_filtro vcf
              join calidad.cal_asignacion ca on ca.rep_id = vcf.rep_id
              where vcf.estado_transferencia = 13`;
  // var query = `select distinct row_number()over(order by depto)nro, depto, mpio, comunidad, vcf.ag_unico, vcf.ae_unico, vcf.cod_cuest, 
  //             vcf.cue_titulo, cod_empadronador, empadronador,vcf.estado_rep, ae.descripcion, vcf.rep_id
  //             from autenticacion.vw_calidad_filtro vcf 
  //             join (
  //             SELECT max(distinct  ao.obs_id) obs_id, ao.rep_id--, ao.obs_observacion, ao.obs_justificacion, ao.obs_fecha_creacion
  //             FROM cuestionarios.apk_observaciones ao 
  //             where ao.estado_transferencia = 13 
  //             group by ao.rep_id) a on a.obs_id = vcf.obs_id
  //             join cuestionarios.apk_estados ae on ae.id_estado = vcf.estado_rep`;
  await con.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        title: "Error",
        icon: "error",
        text: err.message 
      });
    }
    // console.log(result.rows, "<=== resultado");

    if (result.rowCount > 0) {
      return res.status(200).json({
        title: "Cuestionarios",
        icon: "success",
        text: "Cuestionarios listados exitosamente",
        data: result.rows
      });
    } else {
      return res.status(200).json({
        title: "Cuestionarios",
        icon: "info",
        text: "No hay cuestionarios disponibles"
      });
    }
  });
};

const asignarUsuario = async (req, res) => {
  var query = `SELECT  vu.aut_id_usuario id_usuario, concat(vu.aut_us_nombres,' ',vu.aut_us_paterno,' ',vu.aut_us_materno) nombres  
                from monitoreo.vw_usuarios vu 
                join autenticacion.rol r on r.id_rol = vu.aut_us_rol
                where r.id_rol in(16,17)`;

  await con.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        title: "Error",
        icon: "error",
        text: err.message
      });
    }
    if (result.rowCount > 0) {
      return res.status(200).json({
        title: "Asistentes",
        icon: "success",
        text: "Asistentes listados exitosamente",
        data: result.rows
      });
    } else {
      return res.status(200).json({
        title: "Asistentes",
        icon: "info",
        text: "No hay asistentes disponibles"
      });
    }
  });
};

const asigname = async (req, res) => { 
  const _user = await userData(req, res);
  // console.log(req.body , '<=== body');
  // console.log(_user);
  
  if (!_user) {
    return res.status(401).json({
      title: "Unauthorized",
      icon: "error",
      text: "No estás autorizado para realizar esta acción" 
    });
  } else {

    var usuarioAsig = await con.query(`select usu_asig_id, rep_id from "calidad"."cal_asignacion" where id = ${req.body.ids}`);
    // console.log(`UPDATE "cuestionarios"."apk_observaciones" SET "estado_transferencia" = 0 WHERE "rep_id" = ${usuarioAsig.rows[0].rep_id} and estado_transferencia  = 13 and tipo = 'CUESTIONARIO';`);
    await con.query(`UPDATE "cuestionarios"."apk_observaciones" SET "estado_transferencia" = 0, estado_id= 5 WHERE "rep_id" = ${usuarioAsig.rows[0].rep_id} and estado_transferencia  = 13 and tipo = 'CUESTIONARIO';`)
    
    await con.query(`UPDATE "cuestionarios"."apk_replicas" SET "fk_id_estado" = 5 WHERE "rep_id" = ${usuarioAsig.rows[0].rep_id};`)
    await con.query(
      `UPDATE "calidad"."cal_asignacion" SET  "usu_asig_id" = ${_user.id_usuario} , "usu_ant_id"= ${usuarioAsig.rows[0].usu_asig_id}, "fecha_reasignacion" = CURRENT_TIMESTAMP WHERE "id" = ${req.body.ids};`,
      (err, result) => {
        console.log(result);
        
        if (err) {
          return res.status(500).json({
            title: "Error",
            icon: "error",
            text: err.message
          });
        }
        if (result.rowCount > 0) {
          return res.status(200).json({
            title: "Asignación",
            icon: "success",
            text: "Asignación realizada exitosamente"
          });
        }
      }
    );
  }
};
module.exports = {
  listarCuestionarios,
  asignarUsuario,
  asigname
};
