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
        else if(instruccion.tipo == TIPO_INSTRUCCION.WHILEE){
            ejecutarwhile(instruccion, tsglobal, tslocal);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.IFF){
            ejecutarif(instruccion, tsglobal, tslocal);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.ASIGNACION){
            ejecutarasignacion(instruccion, tsglobal, tslocal);
        }
    });
}

function ejecutarif(instruccion, tsglobal, tslocal){
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal);
    if(valor.valor==true){
        ejecutarbloqueglobal(instruccion.cuerpoverdadero,tsglobal,tslocal);
    }
    else if(valor.valor==false){
        if(instruccion.cuerpofalso!=undefined){
            ejecutarbloqueglobal(instruccion.cuerpofalso,tsglobal,tslocal);
        }
    }
}

function ejecutarwhile(instruccion, tsglobal, tslocal){
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal);
    while(valor.valor){
        ejecutarbloqueglobal(instruccion.instrucciones,tsglobal,tslocal);
        valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal);
    }
}

function ejecutardeclaracion(instruccion, tsglobal, tslocal){
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

function ejecutarasignacion(instruccion, tsglobal, tslocal){
    var valor = procesarexpresion(instruccion.expresion,tsglobal, tslocal);
    /*if(tslocal.obtener(instruccion.identificador)!=undefined){
        tslocal.actualizar(instruccion.identificador, valor);
    }
    else */if(tsglobal.obtener(instruccion.identificador)!=undefined){
        tsglobal.actualizar(instruccion.identificador, valor);
    }
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
    else if(expresion.tipo == TIPO_OPERACION.MENOR){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        switch(valorIzq.tipo){
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        //if(3.0<5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if(3.0<"hola")
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3.0<true)
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.CADENA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MAYOR){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        switch(valorIzq.tipo){
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        //if(3.0<5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if(3.0<"hola")
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3.0<true)
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.CADENA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MENORIGUAL){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        switch(valorIzq.tipo){
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        //if(3.0<5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor<=valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if(3.0<"hola")
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3.0<true)
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.CADENA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MAYORIGUAL){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        switch(valorIzq.tipo){
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        //if(3.0<5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor>=valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if(3.0<"hola")
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3.0<true)
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.CADENA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.IGUALIGUAL){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        switch(valorIzq.tipo){
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        //if(3.0<5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor==valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if(3.0=="hola")
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3.0<true)
                        var valor2;
                        if(valorDer.valor==true){
                            valor2=1;
                        }
                        else if(valorDer.valor==false){
                            valor2=0;
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor==valor2 };
                }
                break;
            case TIPO_DATO.CADENA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor==valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        var valor1;
                        if(valorIzq.valor==true){
                            valor1=1;
                        }
                        else if(valorIzq.valor==false){
                            valor1=0;
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: valor1==valorDer.valor };
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor==valorDer.valor };
                }
                break;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.NOIGUAL){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal);
        switch(valorIzq.tipo){
            case TIPO_DATO.DECIMAL:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        //if(3.0<5.0)
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!=valorDer.valor };
                    case TIPO_DATO.CADENA:
                        //if(3.0=="hola")
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        //if(3.0<true)
                        var valor2;
                        if(valorDer.valor==true){
                            valor2=1;
                        }
                        else if(valorDer.valor==false){
                            valor2=0;
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!=valor2 };
                }
                break;
            case TIPO_DATO.CADENA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.CADENA:
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!=valorDer.valor };
                    case TIPO_DATO.BANDERA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                }
                break;
            case TIPO_DATO.BANDERA:
                switch(valorDer.tipo){
                    case TIPO_DATO.DECIMAL:
                        var valor1;
                        if(valorIzq.valor==true){
                            valor1=1;
                        }
                        else if(valorIzq.valor==false){
                            valor1=0;
                        }
                        return { tipo:TIPO_DATO.BANDERA, valor: valor1!=valorDer.valor };
                    case TIPO_DATO.CADENA:
                        console.log('Error semantico los tipos no se pueden operar en el caso del menor');
                        return undefined;
                    case TIPO_DATO.BANDERA:
                        return { tipo:TIPO_DATO.BANDERA, valor: valorIzq.valor!=valorDer.valor };
                }
                break;
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