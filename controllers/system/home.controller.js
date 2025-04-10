/* eslint-disable curly */
const { con } = require("../../config/db");
const { userData } = require("../../lib/auth");

const getEstadisticas= async(req, res)=>{
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
        var query13 = `select count(*), (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 ) total,
                    round(count(*)*100 / (select count(ar2.fk_id_estado) from cuestionarios.apk_replicas ar2 )) porcentaje
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
            title:'Correcto',
            icon:'success',
            text: resultado 
        })

}
const getAprobados = async(req, res)=>{
    // var result = await con.query(`select vcf.depto, vcf.mpio, vcf.ag_unico, vcf.ae_unico, vcf.empadronador, vcf.cod_cuest , ae.descripcion
    //                 from cuestionarios.apk_replicas ar 
    //                 join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = ar.rep_id
    //                 join cuestionarios.apk_estados ae on ae.id_estado = ar.fk_id_estado
    //                 where ar.fk_id_estado  = 7`)
    var result = await con.query(`select row_number() over(order by ar.fecha_sincronizacion) nro, ar.rep_id, vcf.depto, vcf.mpio, vcf.ag_unico, vcf.ae_unico, vcf.empadronador, 
                        vcf.cod_cuest, ar.fecha_sincronizacion, vu.aut_us_nombres || ' ' || vu.aut_us_paterno || ' ' || vu.aut_us_materno as tecnico_calidad, 
                        ca.fecha_asignacion, pen.obs_fecha_creacion as fecha_inicio, val.obs_fecha_creacion as fecha_aprobacion, ae.descripcion
                        from cuestionarios.apk_replicas ar 
                        join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = ar.rep_id
                        join cuestionarios.apk_estados ae on ae.id_estado = ar.fk_id_estado
                        join  (SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY rep_id ORDER BY id DESC) AS rn
                                FROM calidad.cal_asignacion) a WHERE a.rn = 1) ca on ca.rep_id = ar.rep_id
                        left join  (select ao.rep_id, ao.obs_fecha_creacion from cuestionarios.apk_observaciones ao 
                                    where tipo = 'CUESTIONARIO' and ao.estado_id = 5) pen on pen.rep_id = ar.rep_id
                        left join  (select ao.rep_id, ao.obs_fecha_creacion from cuestionarios.apk_observaciones ao 
                                    where tipo = 'CUESTIONARIO' and ao.estado_id = 7) val on val.rep_id = ar.rep_id	
                        join monitoreo.vw_usuarios vu on vu.aut_id_usuario = ca.usu_asig_id			
                        where ar.fk_id_estado = 7 and ar.fk_cue_id = 1`)
    return res.status(200).json({
        title:'Correcto',
        icon:'success',
        text: 'Datos obtenidos correctamente',
        data: result.rows
    })
}
const getObservados = async(req, res)=>{
    var result = await con.query(`select vcf.depto, vcf.mpio, vcf.ag_unico, vcf.ae_unico, vcf.empadronador, vcf.cod_cuest , ae.descripcion
        from cuestionarios.apk_replicas ar 
        join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = ar.rep_id
        join cuestionarios.apk_estados ae on ae.id_estado = ar.fk_id_estado
        where ar.fk_id_estado  = 4`)
return res.status(200).json({
title:'Correcto',
icon:'success',
text: 'Datos obtenidos correctamente',
data: result.rows
})
}
const getTransferidos = async(req, res)=>{
    var result = await con.query(`select vcf.depto, vcf.mpio, vcf.ag_unico, vcf.ae_unico, vcf.empadronador, vcf.cod_cuest , ae.descripcion
        from cuestionarios.apk_replicas ar 
        join autenticacion.vw_calidad_filtro vcf on vcf.rep_id = ar.rep_id
        join cuestionarios.apk_estados ae on ae.id_estado = ar.fk_id_estado
        where ar.fk_id_estado  = 5`)
return res.status(200).json({
title:'Correcto',
icon:'success',
text: 'Datos obtenidos correctamente',
data: result.rows
})
}
module.exports = {
    getEstadisticas,
    getObservados,
    getAprobados,
    getTransferidos
}