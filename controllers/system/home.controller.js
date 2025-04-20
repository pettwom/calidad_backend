/* eslint-disable curly */
const { con } = require("../../config/db");
const { userData } = require("../../lib/auth");

const getEstadisticas = async (req, res) => {
    var resultado = [''];
    const user = userData(req);
    if (!user) return res.status(401).json({ error: "No estás autenticado" });
    var query4 = `select count(*), (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 ) total,
                    round(count(*)*100 / (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 )) porcentaje
                    from cuestionarios.apk_replicas ar 
                    where ar.fk_id_estado = 4;
`;
    var query7 = `select count(*), (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 ) total,
                    round(count(*)*100 / (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 )) porcentaje
                    from cuestionarios.apk_replicas ar 
                    where ar.fk_id_estado = 7;`;
    var query5 = `select count(*), (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 ) total,
                    round(count(*)*100 / (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 )) porcentaje
                    from cuestionarios.apk_replicas ar 
                    where ar.fk_id_estado = 5;`;
    var query13 = `select count(*), (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 where ar2.fk_cue_id = 1 ) total,
                    round(count(*)*100 / (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 where ar2.fk_cue_id = 1 )) porcentaje
                    from cuestionarios.apk_replicas ar 
                    where ar.fk_id_estado = 13;`;
    var observado = await con.query(query4)
    var aprobado = await con.query(query7)
    var pendiente = await con.query(query5)
    var transferido = await con.query(query13)
    resultado[0] = {
        observado: observado.rows[0] ?? '',
        aprobado: aprobado.rows[0] ?? '',
        pendiente: pendiente.rows[0] ?? '',
        transferido: transferido.rows[0] ?? ''
    };
    return res.status(200).json({
        title: 'Correcto',
        icon: 'success',
        text: resultado
    })

}
const getAprobados = async (req, res) => {
    var result = await con.query(`select row_number() over(order by ar.rep_id)nro, ar.rep_id, ar.fk_id_estado, a.estado_id, 
                                case when a.estado_id is null then 'APROBACIóN DIRECTA' else 'APROBADO CALIDAD' end descripcion,
                                a.obs_fecha_creacion fecha_aprobacion_calidad, b.obs_fecha_creacion fecha_inicio_calidad, 
                                vcf.depto, vcf.mpio, vcf.ag_unico , vcf.ae_unico, vu.aut_us_nombres|| ' '||vu.aut_us_paterno||' '||vu.aut_us_materno tecnico_calidad,
                                vu1.aut_us_nombres|| ' '||vu1.aut_us_paterno||' '||vu1.aut_us_materno empadronador,
                                ar.rep_folio_upa cod_cuest
                                from cuestionarios.apk_replicas ar 
                                left join (select ao.obs_id, ao.rep_id, ao.estado_id, ao.obs_fecha_creacion,ao.usucre_id
                                from cuestionarios.apk_observaciones ao 
                                where tipo= 'CUESTIONARIO' and ao.estado_id = 7) a on a.rep_id = ar.rep_id
                                left join (select ao.obs_id, ao.rep_id, ao.estado_id, ao.obs_fecha_creacion,ao.usucre_id
                                from cuestionarios.apk_observaciones ao 
                                where tipo= 'CUESTIONARIO' and ao.estado_id = 5) b on b.rep_id = ar.rep_id
                                left join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = ar.rep_id
                                left join monitoreo.vw_usuarios vu on vu.aut_id_usuario = a.usucre_id
                                left join monitoreo.vw_usuarios vu1 on vu1.aut_id_usuario = ar.fk_usu_id
                                where ar.fk_id_estado = 7 order by 1`)
    // var result = await con.query(`select row_number()over(order by ar.rep_id)nro,ar.rep_id, vcf.depto, vcf.mpio, vcf.ag_unico, vcf.ae_unico, vcf.empadronador, 
    //                             vcf.cod_cuest,vu.aut_us_nombres || ' ' || vu.aut_us_paterno || ' ' || vu.aut_us_materno as tecnico_calidad, 
    //                             to_char((
    //                             select distinct ao.obs_fecha_creacion from cuestionarios.apk_observaciones ao1 where ao1.estado_id = 5 and ao.rep_id = ao1.rep_id
    //                             ), 'dd-mm-yyyy HH:mm')fecha_inicio_calidad, 
    //                             to_char((
    //                             select distinct ao.obs_fecha_creacion from cuestionarios.apk_observaciones ao1 where ao1.estado_id = 7 and ao.rep_id = ao1.rep_id
    //                             ), 'dd-mm-yyyy HH:mm')fecha_fin_calidad, ae.descripcion
    //                             from cuestionarios.apk_replicas ar 
    //                             join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = ar.rep_id
    //                             join cuestionarios.apk_observaciones ao on ao.rep_id = ar.rep_id 
    //                             join cuestionarios.apk_estados ae on ae.id_estado = ar.fk_id_estado
    //                             join monitoreo.vw_usuarios vu on vu.aut_id_usuario = ao.usucre_id 		
    //                             where ar.fk_id_estado = 7 and ar.fk_cue_id = 1 and ao.tipo = 'CUESTIONARIO'`)
    // console.log(result.rows);

    return res.status(200).json({
        title: 'Correcto',
        icon: 'success',
        text: 'Datos obtenidos correctamente',
        data: result.rows
    })
}
const getObservados = async (req, res) => {
    var result = await con.query(`select vcf.depto, vcf.mpio, vcf.ag_unico, vcf.ae_unico, vcf.empadronador, vcf.cod_cuest , ae.descripcion
        from cuestionarios.apk_replicas ar 
        join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = ar.rep_id
        join cuestionarios.apk_estados ae on ae.id_estado = ar.fk_id_estado
        where ar.fk_id_estado  = 4`)
    return res.status(200).json({
        title: 'Correcto',
        icon: 'success',
        text: 'Datos obtenidos correctamente',
        data: result.rows
    })
}
const getTransferidos = async (req, res) => {
    var result = await con.query(`select vcf.depto, vcf.mpio, vcf.ag_unico, vcf.ae_unico, vcf.empadronador, vcf.cod_cuest , ae.descripcion
        from cuestionarios.apk_replicas ar 
        join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = ar.rep_id
        join cuestionarios.apk_estados ae on ae.id_estado = ar.fk_id_estado
        where ar.fk_id_estado  = 5`)
    return res.status(200).json({
        title: 'Correcto',
        icon: 'success',
        text: 'Datos obtenidos correctamente',
        data: result.rows
    })
}
const getDataGrafico = async (req, res) => {
    // try{
   var result =  await con.query(`
 
select count(1)::int y , 'REVISION_CALIDAD' name
from cuestionarios.apk_replicas ar 
where ar.fk_id_estado = 5
union all
select count(1)::int y , 'OBSERVADO' name
from cuestionarios.apk_replicas ar 
where ar.fk_id_estado = 4
union all 
select count(1)::int y , 'TRANSFERIDO' name
from cuestionarios.apk_replicas ar 
where ar.fk_id_estado = 13
union all 
select count(1)::int y , 'APK' name
from cuestionarios.apk_replicas ar 
where ar.fk_id_estado in(8,10)
union ALL
select count(1)::int y  , 'APROBADOS' name
from cuestionarios.apk_replicas ar 
where ar.fk_id_estado = 7
union ALL
select count(1)::int y , 'SIN_ASIGNAR' name
from cuestionarios.apk_replicas ar 
where ar.fk_id_estado <=3
union all 
select count(1)::int y , 'RECHAZADOS' name
from cuestionarios.apk_replicas ar 
where ar.fk_id_estado =18`);


    return res.status(200).json({
        title: 'Correcto',
        icon: 'success',
        text: result.rowCount > 0 ? 'Datos obtenidos correctamente' : 'No se encontraron datos',
        data: result.rowCount > 0 ? result.rows : ''
    })
    // }catch (error) {
    //     console.log(error);
    //     return res.status(500).json({
    //         title: 'Error',
    //         icon: 'error',
    //         text: 'Error al obtener los datos',
    //         error: error.message
    //     })
    // }
}
module.exports = {
    getEstadisticas,
    getObservados,
    getAprobados,
    getTransferidos,
    getDataGrafico
}