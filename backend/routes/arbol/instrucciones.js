const TIPO_VALOR = {
    DECIMAL:            'VAL_DECIMAL',
    CADENA:             'VAL_CADENA',
    BANDERA:            'VAL_BANDERA',
    IDENTIFICADOR:      'VAL_IDENTIFICADOR'
}

const TIPO_OPERACION = {
    SUMA:               'OP_SUMA',
    RESTA:              'OP_RESTA',
    MULTIPLICACION:     'OP_MULTIPLICACION',
    DIVISION:           'OP_DIVISION',
    NEGATIVO:           'OP_NEGATIVO'
}

const TIPO_INSTRUCCION = {
    IMPRIMIR:           'INSTR_IMPRIMIR',
    DECLARACION:        'INSTR_DECLARACION'
}

const INSTRUCCIONES = {
    nuevaOperacionBinaria: function(tipo, operandoIzq, operandoDer){
        return {
            tipo: tipo,
            operandoIzq: operandoIzq,
            operandoDer: operandoDer
        }
    },
    nuevaOperacionUnaria: function(tipo, operandoIzq){
        return {
            tipo: tipo,
            operandoIzq: operandoIzq,
            operandoDer: undefined
        }
    },
    nuevoValor: function(tipo, valor){
        return {
            tipo:tipo,
            valor:valor
        }
    },
    nuevaDeclaracion: function(tipo, id, expresion){
        return {
            tipo: TIPO_INSTRUCCION.DECLARACION,
            tipo_dato:tipo,
            id:id,
            expresion
        }
    },
    nuevoImprimir: function(expresion){
        return{
            tipo: TIPO_INSTRUCCION.IMPRIMIR,
            expresion: expresion
        }
    }
}

module.exports.TIPO_VALOR=TIPO_VALOR;
module.exports.TIPO_OPERACION=TIPO_OPERACION;
module.exports.TIPO_INSTRUCCION=TIPO_INSTRUCCION;
module.exports.INSTRUCCIONES=INSTRUCCIONES;