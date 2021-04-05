const TIPO_INSTRUCCION = require('../arbol/instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('../arbol/instrucciones').TIPO_OPERACION;
const TIPO_VALOR = require('../arbol/instrucciones').TIPO_VALOR;
const TIPO_DATO = require('../arbol/tablasimbolos').TIPO_DATO;

const TS = require('../arbol/tablasimbolos').TS;
let salida = '';

function ejecutar(arbol){
    salida='';
    let tsglobal = new TS([]);
    console.log('Entro')
    ejecutarbloqueglobal(arbol, tsglobal, undefined);

    return salida;
}

function ejecutarbloqueglobal(instrucciones, tsglobal, tslocal){
    instrucciones.forEach((instruccion)=>{
        if(instruccion.tipo == TIPO_INSTRUCCION.DECLARACION){
            ejecutardeclaracion(instruccion, tsglobal,tslocal);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.IMPRIMIR){
            ejecutarimprimir(instruccion, tsglobal, tslocal);
        }
        /*else if(instrucciones.tipo == TIPO_INSTRUCCION.WHILE){
            ///Aca crean la local
            ///Aca le agrega a la local lo de la local previa
            ejecutarwhile(instruccion, tsglobal, tslocal);
        }*/
    });
}

/*function ejecutarwhile(instruccion, tsglobal, tslocal){
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal);
    while(valor.valor){
        ejecutarbloqueglobal(instruccion.cuerpo);
        valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal);
    }
}*/

function ejecutardeclaracion(instruccion, tsglobal, tslocal){
    console.log('hola')
    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal);
    tsglobal.agregar(instruccion.tipo_dato, instruccion.id, valor);
}

function ejecutarimprimir(instruccion, tsglobal, tslocal){
    console.log('hola')

    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal);
    console.log(valor)
    salida+=valor.valor+'\n';
    console.log(valor.valor);
}

function procesarexpresion(expresion, tsglobal, tslocal){
    if(expresion.tipo == TIPO_OPERACION.SUMA){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor+valorDer.valor };
        }
        else if(valorIzq.tipo == TIPO_DATO.CADENA && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor+String(valorDer.valor)};
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.CADENA){
            return { tipo:TIPO_DATO.CADENA, valor: String(valorIzq.valor)+valorDer.valor};
        }
        else if(valorIzq.tipo == TIPO_DATO.CADENA && valorDer.tipo == TIPO_DATO.CADENA){
            return { tipo:TIPO_DATO.CADENA, valor: valorIzq.valor+valorDer.valor};
        }
        else if(valorIzq.tipo == TIPO_DATO.BANDERA && valorDer.tipo == TIPO_DATO.CADENA){
            return { tipo:TIPO_DATO.CADENA, valor: String(valorIzq.valor)+valorDer.valor};
        }
        else if(valorIzq.tipo == TIPO_DATO.CADENA && valorDer.tipo == TIPO_DATO.BANDERA){
            return { tipo:TIPO_DATO.CADENA, valor: String(valorIzq.valor)+String(valorDer.valor)};
        }
        else {
            console.log('Error semantico los tipos no se pueden sumar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.RESTA){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor-valorDer.valor };
        }
        else {
            console.log('Error semantico los tipos no se pueden restar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MULTIPLICACION){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*valorDer.valor };
        }
        else {
            console.log('Error semantico los tipos no se pueden multiplicar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.DIVISION){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        
        if(valorDer.tipo == TIPO_DATO.DECIMAL && valorDer.valor == 0){
            console.log('Error semantico el divisor es 0');
            return undefined;
        }
        else if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor/valorDer.valor };
        }
        else {
            console.log('Error semantico los tipos no se pueden dividir');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.NEGATIVO){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        
        if(valorIzq.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*-1 };
        }
        else {
            console.log('Error semantico los tipos no se puede volver negativo');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_VALOR.DECIMAL){
        return { tipo:TIPO_DATO.DECIMAL, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.CADENA){
        return { tipo:TIPO_DATO.CADENA, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.BANDERA){
        return { tipo:TIPO_DATO.BANDERA, valor: expresion.valor}
    }
    else if(expresion.tipo == TIPO_VALOR.IDENTIFICADOR){
        if(tslocal != undefined){
            var valorr = tslocal.obtener(expresion.valor);
            if(valorr){
                return { tipo:valorr.tipo, valor:valorr.valor };
            }
            else{
                valorr = tsglobal.obtener(expresion.valor);
                if(valorr){
                    return { tipo:valorr.tipo, valor:valorr.valor };
                }
                else {
                    return undefined;
                }
            }
        }
        else{
            var valorr = tsglobal.obtener(expresion.valor);
            if(valorr){
                console.log(valorr)
                return { tipo:valorr.tipo, valor:valorr.valor };
            }
            else {
                return undefined;
            }
        }
    }
}

module.exports.ejecutar = ejecutar;