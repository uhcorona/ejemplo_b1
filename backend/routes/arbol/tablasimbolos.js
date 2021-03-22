const TIPO_DATO = {
    DECIMAL:        'VAL_DECIMAL',
    CADENA:         'VAL_CADENA',
    BANDERA:        'VAL_BANDERA'
}

function crearSimbolo(tipo, id, valor){
    return {
        tipo: tipo,
        id: id,
        valor: valor
    }
}

class TS {
    constructor(simbolos) {
        this._simbolos = simbolos;
    }
    agregar(tipo, id, valor){
        var simbolo = this._simbolos.filter((simbolo)=>simbolo.id==id)[0];
        if(simbolo){
            //Manejan si no existe variable
            console.log('La variable ya existe');
        }
        else{
            if(tipo == valor.tipo){
                // Si hay casteos implicitos aca los verifican
                this._simbolos.push(crearSimbolo(tipo, id, valor));
            }
            else {
                // Manejan si el casteo no exites
                console.log('Error Semantico');
            }
        }
    }
    obtener(id){
        var simbolo = this._simbolos.filter((simbolo)=>simbolo.id==id)[0];
        if(simbolo){
            return simbolo;
        }
        else{
            //Manejar que devolvorean si no existe
            console.log('No existe la variable: '+id);
        }
    }
    get simbolos() {
        return this._simbolos;
    }
}

module.exports.TIPO_DATO = TIPO_DATO;
module.exports.TS = TS;

/*
    Guia para tablas
    int b=0;
    int a=1;
    if(true){
    int a=0;
    }
    int a=0;
    
    ts = new ts([]);
    //ts->se creo a y b
    ejecutarif(ts);
    ejecutarif(ts){
        tsif = new ts(ts);
        //tsif -> ya incluye a y b; 
    }
*/