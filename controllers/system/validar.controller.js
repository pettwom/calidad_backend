/* eslint-disable default-case */
/* eslint-disable curly */
/* eslint-disable no-undef */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
const { loggers } = require("winston");
const { con, con_mon } = require("../../config/db");
const { userData } = require("../../lib/auth");
var array = [];
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
      // console.log(`
      //   select distinct vcf.depto, vcf.cod_depto, vcf.mpio, vcf.cod_municipio
      //   from autenticacion.vw_calidad_filtro vcf
      //   where cod_depto = '${id_depto}'`);

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
const getCom = async (req, res) => {
  var id_depto = req.params.depto;
  var id_mpio = req.params.mpio;

  await con_mon.query(
    `
        select distinct cod_com, comunidad
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
const getAg = async (req, res) => {
  // console.log(req.params);
  var id_depto = req.params.depto;
  var id_mpio = req.params.mpio;
  var id_com = req.params.com;
  await con_mon.query(
    `
        select distinct vcf.depto, vcf.cod_depto, vcf.mpio, vcf.cod_municipio, vcf.ag_unico
        from autenticacion.vw_calidad_filtro vcf 
        where cod_depto = '${id_depto}' and cod_municipio = '${id_mpio}' and cod_com = '${id_com}'`,
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
          data: ""
        });
      }
    }
  );
};

const getEmp = async (req, res) => {
  // console.log(req.params);

  var depto = req.params.depto;
  var mpio = req.params.mpio;
  var com = req.params.com;
  var ag = req.params.ag;
  var ae = req.params.ae;
  var query = `select distinct cod_empadronador, empadronador from autenticacion.vw_calidad_filtro vcf where `;
  query += depto != "null" ? ` cod_depto = '${depto}' ` : "";
  query += mpio != "null" ? ` and cod_municipio = '${mpio}' ` : "";
  query += com != "null" ? ` and cod_com = '${com}' ` : "";
  query += ag != "null" ? ` and ag_unico = '${ag}' ` : "";
  query += ae != "null" ? ` and ae_unico = '${ae}' ` : "";
  // console.log(query, "<=== empadronador");

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
  const _user = await userData(req, res);
  var depto = req.params.depto != "null" ? ` vcf.cod_depto = '${req.params.depto}'` : "";
  var mpio = req.params.mpio != "null" ? ` and vcf.cod_municipio ='${req.params.mpio}'` : "";
  var com = req.params.com != "null" ? ` and vcf.cod_com ='${req.params.com}'` : "";
  var ag = req.params.ag != "null" ? ` and vcf.ag_unico = '${req.params.ag}'` : "";
  var ae = req.params.ae != "null" ? ` and vcf.ae_unico = '${req.params.ae}'` : "";
  var emp = req.params.emp != "null" ? ` and vcf.cod_empadronador = ${req.params.emp}` : "";
  // console.log(req.params.accion, "<=== accion");

  if (req.params.accion != 2) {
    var verificacion = await VerificarEstados(depto, mpio, com, ag, ae, emp, _user.id_usuario);
  }
  var result = await con_mon.query(
    `select distinct row_number() over(order by vcf.cod_depto )nro, vcf.cod_depto , vcf.depto, vcf.cod_municipio, vcf.mpio, vcf.cod_com, vcf.comunidad, vcf.ag_unico,vcf.ae_unico, 
                vcf.cod_empadronador, vcf.empadronador, vcf.cod_cuest, vcf.rep_id, vcf.estado_rep,
                (select distinct COALESCE(concat(coalesce(vu.aut_us_nombres,''),' ', coalesce(vu.aut_us_paterno,''),' ',coalesce(vu.aut_us_materno, '')),'') nombre
                from calidad.cal_asignacion ca 
                join monitoreo.vw_usuarios vu on vu.aut_id_usuario = ca.usu_asig_id 
                where ca.rep_id = vcf.rep_id and estado_id = (select max(estado_id) estado_id from calidad.cal_asignacion ca2 ))nombre,
                (select distinct to_char(ca.fecha_asignacion, 'dd-mm-yyyy') fecha_asignacion 
                from calidad.cal_asignacion ca 
                join monitoreo.vw_usuarios vu on vu.aut_id_usuario = ca.usu_asig_id 
                where ca.rep_id = vcf.rep_id and estado_id = (select max(estado_id) estado_id from calidad.cal_asignacion ca2 ))fecha_asig,
                (select distinct ae.descripcion
                from calidad.cal_asignacion ca 
                join cuestionarios.apk_estados ae on ae.id_estado = ca.estado_id 
                where ca.rep_id = vcf.rep_id and estado_id = (select max(estado_id) estado_id from calidad.cal_asignacion ca2 ))descripcion,
                             (select distinct ca.estado_id
                from calidad.cal_asignacion ca
                join cuestionarios.apk_estados ae on ae.id_estado = ca.estado_id
                where ca.rep_id = vcf.rep_id and estado_id = (select max(estado_id) estado_id from calidad.cal_asignacion ca2 ))estado_id
                from autenticacion.vw_calidad_filtro vcf 
                where ${depto} ${mpio} ${com} ${ag} ${ae} ${emp};`
  );
  // console.log(`select distinct row_number() over(order by vcf.cod_depto )nro, vcf.cod_depto , vcf.depto, vcf.cod_municipio, vcf.mpio, vcf.cod_com, vcf.comunidad, vcf.ag_unico,vcf.ae_unico,
  //               vcf.cod_empadronador, vcf.empadronador, vcf.cod_cuest, vcf.rep_id, vcf.estado_rep,
  //               (select COALESCE(concat(coalesce(vu.aut_us_nombres,''),' ', coalesce(vu.aut_us_paterno,''),' ',coalesce(vu.aut_us_materno, '')),'') nombre
  //               from calidad.cal_asignacion ca
  //               join monitoreo.vw_usuarios vu on vu.aut_id_usuario = ca.usu_asig_id
  //               where ca.rep_id = vcf.rep_id)nombre,
  //               (select to_char(ca.fecha_asignacion, 'dd-mm-yyyy') fecha_asignacion
  //               from calidad.cal_asignacion ca
  //               join monitoreo.vw_usuarios vu on vu.aut_id_usuario = ca.usu_asig_id
  //               where ca.rep_id = vcf.rep_id)fecha_asig,
  //               (select ae.descripcion
  //               from calidad.cal_asignacion ca
  //               join cuestionarios.apk_estados ae on ae.id_estado = ca.estado_id
  //               where ca.rep_id = vcf.rep_id)descripcion,
  //                            (select ca.estado_id
  //               from calidad.cal_asignacion ca
  //               join cuestionarios.apk_estados ae on ae.id_estado = ca.estado_id
  //               where ca.rep_id = vcf.rep_id)estado_id
  //               from autenticacion.vw_calidad_filtro vcf
  //               where ${depto} ${mpio} ${com} ${ag} ${ae} ${emp};`);

  // console.log("<=== result");

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
      text: "No se encontraron Datos",
      data: ""
    });
  }
};

const VerificarEstados = async (depto, mpio, com, ag, ae, emp, id_usuario) => {
  var res_rep = await con_mon.query(`select vcf.rep_id
    from autenticacion.vw_calidad_filtro vcf
    where  ${depto} ${mpio} ${com} ${ag} ${ae} ${emp}`);
  var res_preg = await con_mon.query(`select distinct cv.pre_numero_pregunta  from calidad.cal_validaciones cv order by 1`);
  var res_ubicacion = await con_mon.query(`select distinct vcf.depto::TEXT, vcf.mpio::TEXT
    from autenticacion.vw_calidad_filtro vcf 
    where  ${depto} ${mpio} ${com} ${ag} ${ae} ${emp}`);
  // console.log(res_preg);
  if (res_rep.rowCount > 0) {
    res_rep.rows.forEach(row => {
      res_preg.rows.forEach(preg => {
        if (preg.pre_numero_pregunta < 30) {
          con_mon.query(
            `select * from  calidad.fn_calidad_bucle_general(${row.rep_id}, ${preg.pre_numero_pregunta} , '${res_ubicacion.rows[0].depto
            }', '${res_ubicacion.rows[0].mpio}', ${id_usuario})`
          );
        } else {
          con_mon.query(
            `select * from calidad.fn_validacion_calidad_general(${preg.pre_numero_pregunta} , ${row.rep_id}, '${res_ubicacion.rows[0].depto
            }', '${res_ubicacion.rows[0].mpio}', ${id_usuario})`
          );
        }
      });
    });
  }
};
// para listado de cuestionario
const getListadoCuestionario = async (req, res) => {
  var idrep = req.params.id_rep;
  const _user = await userData(req, res);
  var user_id = 661;

  var query = `select row_number() over(order by a.cod_cuest) nro, a.*, to_char(ca.fecha_asignacion, 'dd-mm-yyyy')fecha_asig, 
            concat(COALESCE(vu.aut_us_nombres,null),' ',COALESCE (vu.aut_us_paterno,null),' ',COALESCE (vu.aut_us_materno, null)) nombre, ca.estado_id, ce.estado,
            ca.estado_id, ce.estado
            from(select distinct * from autenticacion.vw_calidad_filtro vcf where `;

  query += `)a left join calidad.cal_asignacion ca on ca.rep_id = a.rep_id
          left join monitoreo.vw_usuarios vu on vu.aut_id_usuario = ca.usu_asig_id 
          left join calidad.cal_estado ce on ce.id_estado = ca.estado_id`;
  con_mon.query(query, (err, result) => {
    // console.log(query, "<== query");
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
// Listado de preguntas
// para listado de cuestionario
const getListadoPregunta = async (req, res) => {
  var depto = req.params.depto;
  var mpio = req.params.mpio;
  var ag = req.params.ag;
  var ae = req.params.ae;

  var query = `select row_number() over(order by a.cod_cuest) nro, a.*, to_char(ca.fecha_asignacion, 'dd-mm-yyyy')fecha_asig, 
            concat(COALESCE(vu.aut_us_nombres,null),' ',COALESCE (vu.aut_us_paterno,null),' ',COALESCE (vu.aut_us_materno, null)) nombre, ca.estado_id, ce.estado,
            ca.estado_id, ce.estado
            from(select distinct * from autenticacion.vw_calidad_filtro vcf where `;
  // console.log(depto, mpio, ag, ae);

  query += depto != "null" ? ` cod_depto = '${depto}' ` : "";
  query += mpio != "null" ? ` and cod_municipio = '${mpio}' ` : "";
  query += ag != "null" ? ` and ag_unico = '${ag}' ` : "";
  query += ae != "null" ? ` and ae_unico = '${ae}' ` : "";
  query += `)a left join (SELECT * FROM (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY rep_id ORDER BY id DESC) AS rn
            FROM calidad.cal_asignacion) a
            WHERE a.rn = 1) ca on ca.rep_id = a.rep_id
          left join monitoreo.vw_usuarios vu on vu.aut_id_usuario = ca.usu_asig_id 
          left join calidad.cal_estado ce on ce.id_estado = ca.estado_id`;
  con_mon.query(query, (err, result) => {
    // console.log(query, "<== query");
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
    `UPDATE cuestionarios.apk_replicas set fk_id_estado = 3
    WHERE rep_id = ${req.params.ids}`,
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
  console.log(req.body, "<=== SAVEvALIDAR");
  let _user = await userData(req, res);
  var tipo = req.body.tipo;
  var ids = req.body.ids;
  var tipoRep = req.body.tipoRep;
  var observacion = req.body.dato;
  var estado = tipo;
  var insertarRegistro = true;
  var mensaje = "";
  var preg = req.body.preg;
  var preg_qwery = tipoRep == 2 ? `and ao.pre_num_pregunta = '${preg}'` : '';
  var pre_id = tipoRep == 2 ?` and pre_id = ${req.body.pre_id} ` : ''
  var accion = req.body.accion;
  var obs_id = accion == 'edit'? req.body.obs : '';
  //var obs_id_qwery = accion != 'edit'? ` and obs_id = '${req.body.obs}'` : '';
console.log(req.body.obs);
console.log(typeof req.body.obs == 'number', '<=== obs_id_qwery');

  if (tipoRep == '1') {
    tipoCuest = "CUESTIONARIO";
  } else {
    tipoCuest = "PREGUNTA";
  }
  var estadoCuestionario = await con.query(`
          SELECT obs_id, rep_id, estado_id, tipo 
          FROM cuestionarios.apk_observaciones 
          WHERE rep_id = ${ids} AND tipo = 'CUESTIONARIO'
          ORDER BY cuestionarios.apk_observaciones.obs_id DESC 
          LIMIT 1 `);
  console.log(`
          SELECT obs_id, rep_id, estado_id, tipo 
          FROM cuestionarios.apk_observaciones 
          WHERE rep_id = ${ids} AND tipo = 'CUESTIONARIO'
          ORDER BY cuestionarios.apk_observaciones.obs_id DESC 
          LIMIT 1 `, '<=== estadoCuestionario');
          console.log(` 
            select OBS_ID, pre_id, estado_id, obs_observacion 
            from cuestionarios.apk_observaciones ao 
            where obs_id not in (
            select obs_id
            from cuestionarios.apk_observaciones a 
            where a.obs_id  in(
            select ao.obs_id
            from cuestionarios.apk_observaciones ao 
            where ao.estado_id = 7
            union all 
            select ao.obs_id_mod 
            from cuestionarios.apk_observaciones ao 
            where ao.estado_id = 7)
            )
            and tipo='PREGUNTA' and rep_id= ${ids} 
            ${preg_qwery}   ${pre_id}`, '<=== estadoPreguntas');
  const estadoPreguntas = await con.query(` 
            select OBS_ID, pre_id, estado_id, obs_observacion 
            from cuestionarios.apk_observaciones ao 
            where obs_id not in (
            select obs_id
            from cuestionarios.apk_observaciones a 
            where a.obs_id  in(
            select ao.obs_id
            from cuestionarios.apk_observaciones ao 
            where ao.estado_id = 7
            union all 
            select ao.obs_id_mod 
            from cuestionarios.apk_observaciones ao 
            where ao.estado_id = 7)
            )
            and tipo='PREGUNTA' and rep_id= ${ids} 
            ${preg_qwery}   ${pre_id}
          `);
 

  var pendiente = estadoPreguntas.rows.filter(x => [5, 4, 8, 10].includes(x.estado_id))
  console.log(pendiente, '<=== pendiente');
  console.log(estadoCuestionario.rowCount, '<=== estadoCuestionario FILAS');
  console.log(estadoPreguntas.rowCount, '<=== estadoPreguntas FILAS');
  console.log(estadoPreguntas.rows, '<=== estadoPreguntas FILAS');

  if (tipoRep == '1') {
    switch (estado) {
      case 4:
        if (estadoCuestionario.rowCount > 0 && estadoCuestionario.rows[0].estado_id == 7 && estadoCuestionario.rows[0].estado_id == 13 && estadoPreguntas.rows[0].estado_id == 4) {
          insertarRegistro = false;
          mensaje = "El cuestionario ya se encuentra aprobado. No se permite ninguna acción222";
        } else {
          disabledObservado = true;
        }
        break;
      case 7:
        console.log(estadoCuestionario.rowCount == 0 || pendiente.length == 0);
        console.log(estadoCuestionario.rowCount > 0 || pendiente.length > 0);
        console.log(estadoCuestionario.rowCount > 0 && pendiente.length > 0);
        
        //  if(estadoCuestionario.rowCount>0 && pendiente.length >0 ){
        if (estadoCuestionario.rowCount == 0 || pendiente.length > 0) {
          insertarRegistro = false;
          mensaje = "El cuestionario se encuentra observado. No se puede validar el cuestionario111";
        } else {
          disabledAprobado = true;
        }
        break;
      case 13:
        if (estadoCuestionario.rowCount > 0 && estadoCuestionario.rows[0].estado_id == 7) {
          insertarRegistro = false;
          mensaje = "El cuestionario se encuentra aprobado, no se permite ninguna acción";
        }
        break;
    }
  } else {
    // console.log(estado);
    // console.log(pendiente,'<==== pendiente');

    switch (estado) {
      case 7:
        // console.log('Pendiente ===>',pendiente);

        if (pendiente.rowCount > 0) {
          insertarRegistro = false;
          mensaje = "Existen alertas que aún no fueron aprobadas. No se puede validar la pregunta";
        }
        break;
      case 4:
        if (pendiente.rowCount == 0) {
          insertarRegistro = false;
          mensaje = "No existen alertas observadas. No se puede observar el cuestionario";
        }
        break;
    }
  }
  console.log(insertarRegistro, '<=== insertarRegistro');
  console.log(estado, '<=== estadoCuestionario');
  console.log(tipo);
  console.log(ids,observacion,_user.id_usuario,estado,tipoCuest,' <==== LINEA 559' );

  if (insertarRegistro) {
    var result = [""];
    switch (estado) {
      case 13:
        result = await con.query(
          ` INSERT INTO cuestionarios.apk_observaciones
                (cue_id, rep_id, usu_id, obs_observacion, usucre_id, obs_eliminado, fecha_sincronizacion, id_sincronizacion, device_id, finalizado, estado_id, tipo, estado_transferencia)
                VALUES(1, ${ids}, 0, upper('${observacion}'), ${_user.id_usuario
          }, false, null, productores.generar_codigo_unico_sincronizacion(),
                'server'::character varying, false, 4, '${tipoCuest}',${estado}) RETURNING * `
        );
        break;
      case 7:
        console.log(tipoRep);
        if (tipoRep == '1') {
          // console.log(` INSERT INTO cuestionarios.apk_observaciones
          //       (cue_id, rep_id, usu_id, obs_justificacion, usucre_id, obs_eliminado, fecha_sincronizacion, id_sincronizacion, device_id, finalizado, estado_id, tipo)
          //       VALUES(1, ${ids}, 0, upper('${observacion}'), ${_user.id_usuario}, false, null, productores.generar_codigo_unico_sincronizacion(),
          //       'server'::character varying, false, ${estado}, '${tipo}') RETURNING * `);

          result = await con.query(
            ` INSERT INTO cuestionarios.apk_observaciones
                (cue_id, rep_id, usu_id, obs_justificacion, usucre_id, obs_eliminado, fecha_sincronizacion, id_sincronizacion, device_id, finalizado, estado_id, tipo)
                VALUES(1, ${ids}, 0, upper('${observacion}'), ${_user.id_usuario}, false, null, productores.generar_codigo_unico_sincronizacion(),
                'server'::character varying, false, ${estado}, '${tipoCuest}') RETURNING * `
          );
        } else {
          console.log(ids, pendiente, obs_id, _user.id_usuario, estado, tipo, preg);

          result = await con.query(
            ` INSERT INTO cuestionarios.apk_observaciones
          (cue_id, rep_id, pre_id, usu_id, obs_justificacion,obs_observacion, usucre_id, obs_eliminado, fecha_sincronizacion, id_sincronizacion, 
          device_id, finalizado, estado_id, tipo,pre_num_pregunta, obs_id_mod)
          VALUES(1, ${ids}, ${pendiente[0].pre_id}, 0, upper('${observacion}'), '${obs_id}',${_user.id_usuario}, 
          false, null, productores.generar_codigo_unico_sincronizacion(),
          'server'::character varying, false, ${estado}, '${tipoCuest}','${preg}',${pendiente[0].obs_id}) RETURNING * `
          );
        }
        break;
      case 4:
        console.log(accion, '<=== accion');
        console.log(accion, '<=== accion');
        console.log(accion, '<=== accion');
        var d

        if (tipoCuest == 'PREGUNTA') {
          d = estadoPreguntas.rows[0].obs_id
        } else {
          d = estadoCuestionario.rows[0].obs_id
        }
        if (accion == 'edit') {
          console.log(` UPDATE "cuestionarios"."apk_observaciones" SET "obs_observacion" = '${observacion}',estado_id = 4, "obs_fecha_modificacion" = current_timestamp, "usumod_id" = ${_user.id_usuario
            }
             WHERE "obs_id" = ${d}`);

          result = await con.query(
            ` UPDATE "cuestionarios"."apk_observaciones" SET "obs_observacion" = '${observacion}',estado_id = 4, "obs_fecha_modificacion" = current_timestamp, "usumod_id" = ${_user.id_usuario
            }
             WHERE "obs_id" = ${d}`
          );
        } else {
          result = await con.query(
            ` INSERT INTO cuestionarios.apk_observaciones
                (cue_id, rep_id, usu_id, obs_observacion, usucre_id, obs_eliminado, fecha_sincronizacion, id_sincronizacion, device_id, finalizado, estado_id, tipo)
                VALUES(1, ${ids}, 0, upper('${observacion}'), ${_user.id_usuario
            }, false, null, productores.generar_codigo_unico_sincronizacion(),
                'server'::character varying, false, ${estado}, '${tipoCuest}') RETURNING * `
          );
        }
        break;
    }

    // console.log(result);

    if (tipoRep == 1) {
      if (result.rowCount > 0) {
        console.log(` UPDATE cuestionarios.apk_replicas SET fk_id_estado= ${estado} WHERE rep_id= ${ids} `);

        const updateReplica = await con.query(
          ` UPDATE cuestionarios.apk_replicas SET fk_id_estado= ${estado} WHERE rep_id= ${ids} `
        );

        return res.status(200).json({
          title: "Correcto",
          icon: "success",
          text: "Se registró correctamente",
          data: result.rows
        });
      } else {
        return res.status(200).json({
          title: "Error",
          icon: "error",
          text: "No se guardó el registro",
          data: result.rows
        });
      }
    } else {
      return res.status(200).json({
        title: "Correcto",
        icon: "success",
        text: "Se Justifico correctamente la pregunta",
        data: ""
      });
    }
  } else {
    return res.status(200).json({
      title: "Error",
      icon: "error",
      text: mensaje,
      data: null
    });
  }
};

const saveAsignar = async (req, res) => {
  // console.log(req.body);

  var _user = await userData(req, res);
  var body = req.body;
  var cuest = body.rep_id;
  var depto_id = body.depto_id ? ` cod_depto= '${body.depto_id}' ` : "";
  var depto = body.depto_id ? body.depto_id : "";
  var mpio_id = body.mpio_id ? ` and cod_municipio= '${body.mpio_id}' ` : "";
  var mpio = body.mpio_id ? body.mpio_id : "";
  var com_id = body.com_id ? ` and cod_com= '${body.com_id}' ` : "";
  var ag_id = body.ag_id ? ` and ag_unico= '${body.ag_id}' ` : "";
  var ae_id = body.ae_id ? ` and ae_unico= '${body.ae_id}' ` : "";
  var emp_id = body.emp_id ? ` and cod_empadronador= '${body.emp_id}' ` : "";
  var user_id = body.user_id;
  if (_user) {
    var queryUbicacion = `select distinct vcf.depto, vcf.cod_depto, vcf.mpio, vcf.cod_municipio
        from autenticacion.vw_calidad_filtro vcf
        where ${depto_id} ${mpio_id} ${com_id} ${ag_id} ${ae_id} ${emp_id}`;
    // console.log(queryUbicacion, " <=== saveAsignar");

    var query = await con.query(queryUbicacion);
    try {
      for (let a of cuest) {
        if (a) {
          var datos = await con.query(
            `INSERT INTO calidad.cal_asignacion(
            cod_depto,depto,cod_mpio,mpio,rep_id,usu_asig_id,usu_ant_id,estado_id,usucre,feccre,usumod,fecmod,fecha_asignacion,fecha_reasignacion)
            VALUES($1,$2,$3,$4,$5,$6,null,2,$7, current_timestamp,null, null,current_timestamp,null) RETURNING  id;`,
            [depto, query.rows[0].depto, query.rows[0].cod_municipio, query.rows[0].mpio, a, user_id, _user.id_usuario]
          );
        }
      }
      return res.status(200).json({
        title: "Correcto",
        icon: "success",
        text: "Se Asigno correctamente",
        data: datos.rows
      });
    } catch (e) {
      return res.status(404).json({
        title: "Error",
        icon: "error",
        text: e.message
      });
    }
  } else {
    return res.status(401).json({
      title: "Error",
      icon: "error",
      text: "No se encontro usuario valido",
      data: "jwt expired"
    });
  }
};

const getListadoCuest = async (req, res) => {
  const _user = await userData(req, res);
  var query = `
          select row_number() over(order by ca.depto)nro,ae2.depto, ae2.mpio,ae2.ag_unico, 
ae2.ae_unico,  ar.rep_id, concat(vu.aut_us_nombres,' ',vu.aut_us_paterno,' ',
vu.aut_us_materno)nombres , vu.aut_us_ci,ae.descripcion estado , ae.id_estado estado_id, 
ar.rep_folio_upa cuestionario, ac.cue_titulo ,vcf.cod_empadronador, vcf.empadronador,
(select * from calidad.verificar_observacion_cuestionario(ar.rep_id)
)estados
from calidad.cal_asignacion ca 
join monitoreo.vw_usuarios vu on ca.usu_asig_id = vu.aut_id_usuario
join cuestionarios.apk_replicas ar on ar.rep_id = ca.rep_id 
join autenticacion.vw_calidad_filtro vcf on vcf.rep_id =ar.rep_id
join marco_area.vw_ca_aes_6mpios ae2 on ae2.ae_unico = ar.rep_ae 
join cuestionarios.apk_cuestionarios ac on ac.cue_id = ar.fk_cue_id 
join cuestionarios.apk_estados ae  on ae.id_estado = ar.fk_id_estado and ae.id_estado in (3, 5, 4, 8, 10, 13)  
where ca.id in(
      select id 
      from(
      select max(id)id,rep_id
      from calidad.cal_asignacion ca
      group by rep_id) a 
      )
and usu_asig_id =${_user.id_usuario}`;
  // console.log(query, "<=== getListadoCuest");
  var result = await con.query(query);

  return res.status(200).json({
    title: "Correcto",
    icon: "success",
    text: result.rows ? "Se listo correctamente" : "No se encontraron datos",
    res: result.rows

  });

};
const getAlertas = async (req, res) => {
  const _user = await userData(req, res);
  var datos = [];
  var queryResultado = "";
  var rep_id = req.params.id;
  var getPreg = await con.query(`select distinct cv.pre_numero_pregunta , ap.pre_pregunta
              from calidad.cal_validaciones cv 
              join cuestionarios.apk_preguntas ap on ap.pre_numero_pregunta::text  = cv.pre_numero_pregunta::text
              where cv.pre_numero_pregunta not in( 16,18,29) and fk_sec_id < 227 order by 1`);
  var datosGenerales = await con.query(`select row_number() over(order by ca.depto)nro,ae2.depto, ae2.mpio,ae2.ag_unico, ae2.ae_unico,  ar.rep_id, concat(vu.aut_us_nombres,' ',vu.aut_us_paterno,' ',vu.aut_us_materno)nombres , vu.aut_us_ci,ae.descripcion estado , ae.id_estado estado_id, ar.rep_folio_upa cuestionario, ac.cue_titulo 
                                      from calidad.cal_asignacion ca 
                                      join monitoreo.vw_usuarios vu on ca.usu_asig_id = vu.aut_id_usuario
                                      join cuestionarios.apk_replicas ar on ar.rep_id = ca.rep_id 
                                      join marco_area.vw_ca_aes_6mpios ae2 on ae2.ae_unico = ar.rep_ae 
                                      join cuestionarios.apk_cuestionarios ac on ac.cue_id = ar.fk_cue_id 
                                      join cuestionarios.apk_estados ae  on ae.id_estado = ar.fk_id_estado 
                                      where ca.id in(
                                            select id  
                                            from(
                                            select max(id)id,rep_id
                                            from calidad.cal_asignacion ca
                                            group by rep_id) a 
                                            )
                                      and ar.rep_id =${rep_id}`);

  var verificarRep = await con.query(`select count(*)cant  from cuestionarios.apk_observaciones ao where ao.rep_id = ${rep_id}`);
  // console.log(`select count(*)cant  from cuestionarios.apk_observaciones ao where ao.rep_id = ${rep_id}`);
  // console.log(verificarRep.rows);
  var verCuests = await con.query(`select count(1) cant from cuestionarios.apk_observaciones ao where ao.rep_id = ${rep_id} and ao.tipo ilike 'CUESTIONARIO'`);
  if (verCuests.rows[0].cant == 0) {
    await con.query(`INSERT
							INTO "cuestionarios"."apk_observaciones" 
							     ("cue_id", "rep_id","obs_fecha_creacion","usucre_id","estado_id","tipo")
						VALUES (1, ${rep_id},CURRENT_TIMESTAMP,${_user.id_usuario},5,'CUESTIONARIO');`)
  }
  if (verificarRep.rows[0].cant == 0) {

    await con.query(
      `select * from calidad.fn_calidad_bucle(${rep_id}, 0 ,'${datosGenerales.rows[0].depto}', '${datosGenerales.rows[0].mpio
      }',${_user.id_usuario})`
    );
    for (const a of getPreg.rows) {

      await con.query(
        `select * from calidad.fn_validacion_calidad(${a.pre_numero_pregunta},${rep_id}, '${datosGenerales.rows[0].depto}', '${datosGenerales.rows[0].mpio
        }',${_user.id_usuario}) res`
      );

    }
  }
  queryResultado = `select case 
when ao.pre_id = 502 then 1 
when ao.pre_id = 503 then 2 
when ao.pre_id = 504 then 3 
when ao.pre_id = 716 then 4 
when ao.pre_id = 717 then 5 
when ao.pre_id = 718 then 6 
when ao.pre_id = 719 then 7 
when ao.pre_id = 720 then 8 
when ao.pre_id = 721 then 9 
when ao.pre_id = 722 then 10 
when ao.pre_id = 723 then 11 
when ao.pre_id = 724 then 12 
when ao.pre_id = 725 then 13 
when ao.pre_id = 726 then 14 
when ao.pre_id = 727 then 15 
when ao.pre_id = 728 then 16 
when ao.pre_id = 729 then 17 
when ao.pre_id = 730 then 18 
when ao.pre_id = 731 then 19 
when ao.pre_id = 732 then 20 
end parcela, 
row_number()over(partition by ao.pre_id, ao.pre_num_pregunta order by ao.obs_observacion )nro, 
ao.pre_num_pregunta, 
(select distinct ap.pre_pregunta from cuestionarios.apk_preguntas ap where ap.pre_numero_pregunta  = ao.pre_num_pregunta limit 1),
split_part(ao.obs_observacion,'"',2)cultivo,  ao.obs_observacion, ao.obs_justificacion,  ao.res_val, ao.res_cosecha, ao.estado_id
,ae.descripcion estado, ao.rep_id, ao.obs_id, ao.obs_id_mod, ao.pre_id
from cuestionarios.apk_observaciones ao 
join cuestionarios.apk_replicas ar on ar.rep_id = ao.rep_id
join cuestionarios.apk_estados ae on ao.estado_id = ae.id_estado
where ao.rep_id = ${rep_id} and ao.tipo ilike 'PREGUNTA' and obs_id not in ((select  distinct obs_id_mod
from cuestionarios.apk_observaciones ao1 
where estado_id = 7 and rep_id =${rep_id}
union all 
select  obs_id
from cuestionarios.apk_observaciones ao2 
where estado_id = 7 and rep_id =${rep_id}) )
group by ao.rep_id,ao.obs_id,ao.pre_id, ao.pre_num_pregunta,ae.descripcion ,ao.obs_justificacion,ao.obs_observacion, ao.res_val, ao.res_cosecha, ao.estado_id, ao.obs_id_mod
order by 1,2,3,5`;
  // console.log('getAlertas ====> ',queryResultado);

  //   queryResultado = `select b.*, ar.res_respuesta/*, 
  //                     case 
  //                       when cv.num_cabezas !=0 
  //                         then 
  //                           cv.num_cabezas 

  //                       when cv.sup_max !=0 
  //                         then 
  //                           cv.sup_max 	
  //                       when cv.prod_max !=0 
  //                         then 
  //                           cv.prod_max 
  //                       when cv.rend_max !=0 
  //                         then 
  //                           cv.rend_max
  //                     end res_validacion*/
  //                     from(
  //                         select distinct ao.obs_id, ao.rep_id, ap.pre_id, ap.pre_numero_pregunta ,ap.pre_pregunta, upper(ao.obs_observacion)obs_observacion,
  //                         upper(ao.obs_justificacion)obs_justificacion, ao.estado_id, ae.descripcion as estado
  //                         from cuestionarios.apk_observaciones ao
  //                         join cuestionarios.apk_preguntas ap on ap.pre_numero_pregunta = ao.pre_num_pregunta
  //                         join cuestionarios.apk_estados ae on ae.id_estado = ao.estado_id 
  //                         where ao.rep_id = ${rep_id} and fk_sec_id < 227  and (ap.fk_pre_id = (select pre_id
  //                         from cuestionarios.apk_preguntas ap 
  //                         where ap.pre_numero_pregunta = '16.1')) and ao.obs_id not in( select obs_id
  // 						from cuestionarios.apk_observaciones ao
  // 						join (
  // 						select rep_id, pre_id
  // 						from cuestionarios.apk_observaciones ao 
  // 						where ao.estado_id = 7) a on a.rep_id = ao.rep_id and a.pre_id = ao.pre_id)

  //                   union all
  //                         select distinct ao.obs_id, ao.rep_id, ap.pre_id, ap.pre_numero_pregunta ,ap.pre_pregunta, upper(ao.obs_observacion)obs_observacion , 
  //                         upper(ao.obs_justificacion)obs_justificacion, ao.estado_id, ae.descripcion as estado
  //                         from cuestionarios.apk_observaciones ao
  //                         join cuestionarios.apk_preguntas ap on ap.pre_numero_pregunta = ao.pre_num_pregunta
  //                         join cuestionarios.apk_estados ae on ae.id_estado = ao.estado_id 
  //                         where ao.rep_id = ${rep_id} and fk_sec_id < 227 and ao.pre_num_pregunta not in('16.1','16.2','16.3','18','29') and ao.obs_id not in( select obs_id
  // from cuestionarios.apk_observaciones ao
  // join (
  // select rep_id, pre_id
  // from cuestionarios.apk_observaciones ao 
  // where ao.estado_id = 7) a on a.rep_id = ao.rep_id and a.pre_id = ao.pre_id )
  //                         union all 
  //                         select distinct ao.obs_id, ao.rep_id, ap.pre_id, ap.pre_numero_pregunta ,ap.pre_pregunta, upper(ao.obs_observacion)obs_observacion , 
  //                         upper(ao.obs_justificacion)obs_justificacion, ao.estado_id, ae.descripcion as estado
  //                         from cuestionarios.apk_observaciones ao
  //                         join cuestionarios.apk_preguntas ap on ap.pre_numero_pregunta = ao.pre_num_pregunta
  //                         join cuestionarios.apk_estados ae on ae.id_estado = ao.estado_id 
  //                         where ao.rep_id = ${rep_id} and fk_sec_id < 227  and ap.pre_numero_pregunta  = '16.1'  and ao.obs_id  not in(select obs_id
  // 								from cuestionarios.apk_observaciones ao
  // 								join (
  // 								select rep_id, pre_id
  // 								from cuestionarios.apk_observaciones ao 
  // 								where ao.estado_id = 7) a on a.rep_id = ao.rep_id and a.pre_id = ao.pre_id)
  //                         )b 
  //                   JOIN cuestionarios.apk_respuestas ar on ar.fk_rep_id  = b.rep_id and b.pre_id = ar.pre_id
  //                   --JOIN calidad.cal_validaciones cv on cv.pre_numero_pregunta::text = b.pre_numero_pregunta::text and upper(cv.depto) = 'LA PAZ' and upper(cv.municipio) = 'ACHOCALLA'
  //                   ORDER BY 4 DESC`;
  await con.query(queryResultado, (err, result) => {
    // console.log(result.rows);

    if (err) {
      return res.status(404).json({
        title: "Error",
        icon: "error",
        text: err.message
      });
    }
    if (result.rowCount > 0) {
      return res.status(200).json({
        title: "Correcto",
        icon: "success",
        text: "Se obtuvo todas las alertas",
        data: result.rows
      });
    } else {
      return res.status(200).json({
        title: "Información ",
        icon: "info",
        text: "No se encontraron observaciones",
        data: ""
      });
    }
  });
  // getPreg.rows.forEach((e, i) => {
  //   e.depto = datosGenerales.rows[0].depto,
  //     e.mpio = datosGenerales.rows[0].mpio,
  //     e.ag_unico = datosGenerales.rows[0].ag_unico,
  //     e.ae_unico = datosGenerales.rows[0].ae_unico,
  //     e.rep_id = datosGenerales.rows[0].rep_id,
  //     e.nombres = datosGenerales.rows[0].nombres,
  //     e.cuestionario = datosGenerales.rows[0].cuestionario,
  //     e.cue_titulo = datosGenerales.rows[0].cue_titulo,
  //     e.respuesta = array[i]
  //   });
  // console.log(getPreg,'<====jgh');

  // return res.status(200).json({
  //   title: 'Correcto',
  //   icon:'success',
  //   text: 'Se obtuvo todas las alertas',
  //   data: getPreg
  // })
};
// const aprobarCuest = async(req,res) => {
//   const { rep_id } = req.params;
//   const { _user } = req;
//   const query = `update cuestionarios.apk_replicas set fk_id_estado = 7 where rep_id = ${rep_id}`;
//   await con.query(query, (err, result) => {
//     if (err) {
//       return res.status(404).json({
//         title: "Error",
//         icon: "error",
//         text: err.message
//       });
//     }
//     return res.status(200).json({
//       title: "Correcto",
//       icon: "success",
//       text: "Se aprobó el cuestionario",
//       data: result.rows
//     });
//   });
// }
const getObservacion = async (req, res) => {
  var obs = req.params.id;
  await con.query(
    `select ao.obs_observacion 
                  from cuestionarios.apk_observaciones ao               
                  where ao.obs_id = ${obs}`,
    (err, result) => {
      if (err) {
        return res.status(404).json({
          title: "Error",
          icon: "error",
          text: err.message
        });
      }
      return res.status(200).json({
        title: "Correcto",
        icon: "success",
        text: result.rows ? "Se obtuvo la observación" : "No se encontraron Datos",
        data: result.rows ? result.rows : ""
      });
    }
  );
};
module.exports = {
  getDepto,
  getMpio,
  getCom,
  getAg,
  getAe,
  getEmp,
  getListado,
  migrarDatos,
  getValidar,
  saveValidar,
  saveAsignar,
  getListadoCuest,
  getAlertas,
  getListadoCuestionario,
  getListadoPregunta,
  getObservacion
  // aprobarCuest
};
