const { con } = require("../../config/db");
const { userData } = require("../../lib/auth");

const getLista = async (req, res) => {
  try {
    console.log(req.query);

    const { page, pageSize, search } = req.query; // Get pagination parameters
    const offset = (parseInt(page) - 1) * parseInt(pageSize); // Calculate offset
    const limit = parseInt(pageSize);

    // Improved SQL query for pagination and data retrieval
    var where = `where (pre_numero_pregunta::text ilike '%${search}%' or depto ilike '%${search}%' OR municipio ilike '%${search}%' or 
    rubro ilike '%${search}%' or actividad ilike '%${search}%' or num_cabezas::text ilike '%${search}%' or 
    sup_max::text ilike '%${search}%' or prod_max::text ilike '%${search}%' or rend_max::text ilike '%${search}%')`;

    const sqlQuery = `
      SELECT 
        id,
        row_number() over(order by depto, municipio, pre_numero_pregunta, rubro) as nro,
        pre_numero_pregunta, 
        depto, 
        municipio mpio, 
        rubro, 
        actividad,
        num_cabezas, 
        sup_max, 
        prod_max, 
        rend_max, 
        estado
      FROM calidad.cal_validaciones
      ${where}
      ORDER BY depto, municipio, pre_numero_pregunta, rubro
      LIMIT $1 OFFSET $2
    `;

    console.log(sqlQuery);

    const countQuery = `SELECT count(*) as total FROM calidad.cal_validaciones`;

    // Use parameterized queries to prevent SQL injection
    const result = await con.query(sqlQuery, [limit, offset]);
    const countResult = await con.query(countQuery);
    const totalRecords = countResult.rows[0].total;

    // Send the response in the format expected by DataTables
    res.status(200).json({
      draw: parseInt(req.query.draw, 10) || 0, // Ensure draw is always sent
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords, // In this case, it's the same as total
      data: result.rows.map(row => ({
        // Map the results
        id: parseInt(row.id, 10),
        nro: parseInt(row.nro, 10),
        pre_numero_pregunta: parseInt(row.pre_numero_pregunta, 10),
        depto: row.depto,
        mpio: row.mpio,
        rubro: row.rubro,
        actividad: row.actividad,
        num_cabezas: parseFloat(row.num_cabezas, 10),
        sup_max: parseFloat(row.sup_max, 10),
        prod_max: parseFloat(row.prod_max, 10),
        rend_max: parseFloat(row.rend_max, 10),
        estado: parseInt(row.estado, 10)
      })),
      error: null // Important:  Send null for no error.  DataTables expects this.
    });
  } catch (error) {
    console.error("Error in getLista:", error);
    res.status(500).json({
      // Send a 500 status code for server errors
      error: error.message, // Send the error message
      data: [], // Important:  Send an empty data array on error.
      recordsTotal: 0,
      recordsFiltered: 0
    });
  }
};

const getEditar = async (req, res) => {
  try {
    var result = await con.query(`select * from calidad.cal_validaciones cv where id = ${req.params.ids}`);
    return res.status(200).json({
      title: "Correcto",
      icon: "success",
      text: result.rowCount > 0 ? "Se listo correctamente los datos" : "No se encontraron datos",
      data: result.rowCount > 0 ? result.rows : ""
    });
  } catch (e) {
    return res.json({
      title: "Error",
      icon: "error",
      text: e.message
    });
  }
};

const deleteValidacion = async (req, res) => {
  const _user = await userData(req, res);
  try {
    console.log(req.body);
    await con.query(
      `UPDATE "calidad"."cal_validaciones" SET "estado" = '2', "usumod" = ${
        _user.id_usuario
      }, "fecmod" = current_timestamp WHERE "id" = ${req.body.ids}`
    );

    return res.status(200).json({
      title: "Correcto",
      icon: "success",
      text: "El registro se elimino correctamente"
    });
  } catch (e) {
    return res.json({
      title: "Error",
      icon: "error",
      text: e.message
    });
  }
};

const getNumPreg = async (req, res) => {
  try {
    var result = await con.query(`select distinct cv.pre_numero_pregunta FROM calidad.cal_validaciones cv order by 1`);
    return res.status(200).json({
      success: true,
      data: result.rowCount > 0 ? result.rows : ""
    });
  } catch (e) {
    return res.json({
      title: "Error",
      icon: "error",
      text: e.message
    });
  }
};
const getDepto = async (req, res) => {
  try {
    var result = await con.query(`select distinct depto
                                  from calidad.cal_validaciones cv order by 1`);
    return res.status(200).json({
      success: true,
      data: result.rowCount > 0 ? result.rows : ""
    });
  } catch (e) {
    return res.json({
      title: "Error",
      icon: "error",
      text: e.message
    });
  }
};
const getMpio = async (req, res) => {
  try {
    var result = await con.query(`select distinct municipio
                                  from calidad.cal_validaciones cv 
                                  where depto ilike '%${req.params.depto}%'`);
    return res.status(200).json({
      success: true,
      data: result.rowCount > 0 ? result.rows : ""
    });
  } catch (e) {
    return res.json({
      title: "Error",
      icon: "error",
      text: e.message
    });
  }
};
const getRubro = async (req, res) => {
  try {
    var result = await con.query(`select distinct rubro
                                  from calidad.cal_validaciones cv `);
    return res.status(200).json({
      success: true,
      data: result.rowCount > 0 ? result.rows : ""
    });
  } catch (e) {
    return res.json({
      title: "Error",
      icon: "error",
      text: e.message
    });
  }
};

const saveValidacion = async (req, res) => {
  const _user = await userData(req, res);
  var params = req.body;
  try {
    if (params.tipo == "add") {
      await con.query(`INSERT INTO "calidad"."cal_validaciones" ("pre_numero_pregunta", "depto_id", "depto", "municipio_id", "municipio", "rubro", 
      "actividad", "num_cabezas", "sup_max", "prod_max", "rend_max", "estado", "usucre", "feccre") 
      VALUES (${params.num_preg}, null, '${params.depto}', NULL, '${params.mpio}', '${params.rubro}', '${params.actividad}', ${
        params.num_cabezas
      }, 
      ${params.sup}, ${params.prod}, ${params.rend}, '1', ${_user.id_usuario}, CURRENT_TIMESTAMP)`);
      // console.log(`INSERT INTO "calidad"."cal_validaciones" ("pre_numero_pregunta", "depto_id", "depto", "municipio_id", "municipio", "rubro", 
      // "actividad", "num_cabezas", "sup_max", "prod_max", "rend_max", "estado", "usucre", "feccre") 
      // VALUES (${params.num_preg}, null, '${params.depto}', NULL, '${params.mpio}', '${params.rubro}', '${params.actividad}', ${
      //   params.num_cabezas
      // }, 
      // ${params.sup}, ${params.prod}, ${params.rend}, '1', ${_user.id_usuario}, CURRENT_TIMESTAMP)`);
      
    } else {
      await con.query(`UPDATE "calidad"."cal_validaciones" SET "pre_numero_pregunta" = ${params.num_preg}, "depto" = '${
        params.depto
      }', 
      "municipio" = '${params.mpio}', "rubro" = '${params.rubro}', "actividad" = '${params.actividad}', "num_cabezas" = ${
        params.num_cabezas
      }, 
      "sup_max" = ${params.sup}, "prod_max" = ${params.prod}, "rend_max" = ${params.rend}, "usumod" = ${
        _user.id_usuario
      }, "fecmod" = CURRENT_TIMESTAMP
      WHERE "id" = ${params.ids}`);
    }
    return res.status(200).json({
      title: "Correcto",
      icon: "success",
      text: "Los datos se almacenaron correctamente"
    });
  } catch (e) {
    return res.json({
      title: "Error",
      icon: "error",
      text: e.message
    });
  }
};
module.exports = {
  getLista,
  getNumPreg,
  getDepto,
  getMpio,
  getRubro,
  getEditar,
  deleteValidacion,
  saveValidacion
};
