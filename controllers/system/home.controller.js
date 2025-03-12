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
module.exports = {
    getEstadisticas
  };