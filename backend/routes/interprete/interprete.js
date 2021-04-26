const TIPO_INSTRUCCION = require('../arbol/instrucciones').TIPO_INSTRUCCION;
const TIPO_OPERACION = require('../arbol/instrucciones').TIPO_OPERACION;
const TIPO_VALOR = require('../arbol/instrucciones').TIPO_VALOR;
const TIPO_DATO = require('../arbol/tablasimbolos').TIPO_DATO;

const TS = require('../arbol/tablasimbolos').TS;
let salida = '';
let banderaciclo = false;
function ejecutar(arbol){
    salida='';
    let tsglobal = new TS([]);
    let tslocal = new TS([]);
    let metodos = [];
    let main = [];
    ejecutarbloqueglobal(arbol, tsglobal, tslocal, metodos, main);
    if(main.length==1){
        metodos.forEach(metodo2=>{
            if(metodo2.identificador==main[0].identificador){
                /*Sobrecarga de metodos (NO SE HACE EN ESTE PROYECTO) puede servir en compi2
                    cadena1 = tipo (de todos los identificadores del metodo)
                    cadena2 = tipo (de todos los valores de la llamada)
                    cadena1==cadena2 (sobrecarga hacia match)
                */
                if(metodo2.parametros.length==main[0].parametros.length){
                    var valoresmetodo = [];
                    for(var contador = 0; contador<main[0].parametros.length;contador++){
                        var valor = procesarexpresion(main[0].parametros[contador],tsglobal, tslocal);
                        if(valor.tipo != metodo2.parametros[contador].tipo){
                            //Error el valor mandado no es el mismo que se declaro
                            return;
                        }
                        else{
                            valoresmetodo.push(valor);
                        }       
                    }
                    var tslocal2=new TS([]);
                    for(var contador=0;contador<main[0].parametros.length;contador++){
                        tslocal2.agregar(valoresmetodo[contador].tipo, metodo2.parametros[contador].identificador,valoresmetodo[contador]);
                    }
                    ejecutarbloquelocal(metodo2.instrucciones, tsglobal, tslocal2, metodos);
                }
                else{
                    //Error se estan mandando una cantidad de valores mayor a la que recibe el metodo
                }
            }
        });
    }
    else{
        console.log("No puede haber mas de un main");
    }
    return salida;
}

function ejecutarbloqueglobal(instrucciones, tsglobal, tslocal, metodos, main){
    instrucciones.forEach((instruccion)=>{
        if(instruccion.tipo == TIPO_INSTRUCCION.DECLARACION){
            ejecutardeclaracionglobal(instruccion, tsglobal,tslocal);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.ASIGNACION){
            ejecutarasignacionglobal(instruccion, tsglobal, tslocal);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.METODO){
            metodos.push(instruccion);
        }
        else if(instruccion.tipo==TIPO_INSTRUCCION.MAIN){
            main.push(instruccion);
        }
    });
}

function ejecutarbloquelocal(instrucciones, tsglobal, tslocal, metodos){
    for(var i=0; i<instrucciones.length; i++){
        instruccion = instrucciones[i];
        if(instruccion.tipo == TIPO_INSTRUCCION.DECLARACION){
            ejecutardeclaracionlocal(instruccion, tsglobal,tslocal, metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.IMPRIMIR){
            ejecutarimprimir(instruccion, tsglobal, tslocal, metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.WHILEE){
            var tslocal2=new TS(tslocal._simbolos);
            var posibleretorno = ejecutarwhile(instruccion, tsglobal, tslocal2, metodos);
            if(posibleretorno){
                return posibleretorno;
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.IFF){
            var tslocal2=new TS(tslocal._simbolos);
            console.log('ufff')
            console.log(tslocal._simbolos);
            console.log(tslocal2._simbolos);
            var posibleretorno = ejecutarif(instruccion, tsglobal, tslocal2, metodos);
            if(posibleretorno){
                return posibleretorno;
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.ASIGNACION){
            ejecutarasignacionlocal(instruccion, tsglobal, tslocal, metodos);
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.LLAMADA){
            if(banderaciclo==true){
                banderaciclo = false;
                ejecutarllamada(instruccion, tsglobal, tslocal, metodos);
                banderaciclo = true;
            }
            else{
                ejecutarllamada(instruccion, tsglobal, tslocal, metodos);
            }
        }
        else if(instruccion.tipo == TIPO_INSTRUCCION.BREAK){
            if(banderaciclo){
                return {
                    tipo_resultado: TIPO_INSTRUCCION.BREAK,
                    resultado: undefined
                }
            }
            else {
                console.log("No estas en un ciclo")
            }
        }
    }
}

function ejecutarllamada(instruccion, tsglobal, tslocal, metodos){
    metodos.forEach(metodo2=>{
        if(metodo2.identificador==instruccion.identificador){
            /*Sobrecarga de metodos (NO SE HACE EN ESTE PROYECTO) puede servir en compi2
                cadena1 = tipo (de todos los identificadores del metodo)
                cadena2 = tipo (de todos los valores de la llamada)
                cadena1==cadena2 (sobrecarga hacia match)
            */
            if(metodo2.parametros.length==instruccion.parametros.length){
                var valoresmetodo = [];
                for(var contador = 0; contador<instruccion.parametros.length;contador++){
                    var valor = procesarexpresion(instruccion.parametros[contador],tsglobal, tslocal, metodos);
                    if(valor.tipo != metodo2.parametros[contador].tipo){
                        //Error el valor mandado no es el mismo que se declaro
                        return;
                    }
                    else{
                        valoresmetodo.push(valor);
                    }       
                }
                var tslocal2=new TS([]);
                for(var contador=0;contador<instruccion.parametros.length;contador++){
                    tslocal2.agregar(valoresmetodo[contador].tipo, metodo2.parametros[contador].identificador,valoresmetodo[contador]);
                }
                console.log(tslocal2._simbolos);
                ejecutarbloquelocal(metodo2.instrucciones, tsglobal, tslocal2, metodos);
            }
            else{
                //Error se estan mandando una cantidad de valores mayor a la que recibe el metodo
            }
        }
    });
}

function ejecutarif(instruccion, tsglobal, tslocal, metodos){
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal, metodos);
    if(valor.valor==true){
        return ejecutarbloquelocal(instruccion.cuerpoverdadero,tsglobal,tslocal, metodos);
    }
    else if(valor.valor==false){
        if(instruccion.cuerpofalso!=undefined){
            return ejecutarbloquelocal(instruccion.cuerpofalso,tsglobal,tslocal, metodos);
        }
    }
}

function ejecutarwhile(instruccion, tsglobal, tslocal, metodos){
    banderaciclo = true;
    var valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal, metodos);
    while(valor.valor){
        var posiblevalor=ejecutarbloquelocal(instruccion.instrucciones,tsglobal,tslocal, metodos);
        console.log(posiblevalor)
        if(posiblevalor){
            if(posiblevalor.tipo_resultado==TIPO_INSTRUCCION.BREAK){
                banderaciclo = false;
                break;
            }
        }
        valor = procesarexpresion(instruccion.condicion,tsglobal, tslocal, metodos);
    }
    banderaciclo = false;
}

function ejecutardeclaracionglobal(instruccion, tsglobal, tslocal, metodos){
    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal, metodos);
    tsglobal.agregar(instruccion.tipo_dato, instruccion.id, valor, metodos);
}

function ejecutardeclaracionlocal(instruccion, tsglobal, tslocal, metodos){
    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal, metodos);
    tslocal.agregar(instruccion.tipo_dato, instruccion.id, valor, metodos);
}

function ejecutarimprimir(instruccion, tsglobal, tslocal, metodos){

    var valor = procesarexpresion(instruccion.expresion, tsglobal,tslocal, metodos);
    salida+=valor.valor+'\n';
    console.log(valor.valor);
}

function ejecutarasignacionglobal(instruccion, tsglobal, tslocal, metodos){
    var valor = procesarexpresion(instruccion.expresion,tsglobal, tslocal, metodos);
    if(tsglobal.obtener(instruccion.identificador)!=undefined){
        tsglobal.actualizar(instruccion.identificador, valor, metodos);
    }
}

function ejecutarasignacionlocal(instruccion, tsglobal, tslocal, metodos){
    var valor = procesarexpresion(instruccion.expresion,tsglobal, tslocal, metodos);
    if(tslocal.obtener(instruccion.identificador)!=undefined){
        tslocal.actualizar(instruccion.identificador, valor, metodos);
    }
    else if(tsglobal.obtener(instruccion.identificador)!=undefined){
        tsglobal.actualizar(instruccion.identificador, valor, metodos);
    }
}

function procesarexpresion(expresion, tsglobal, tslocal, metodos){
    if(expresion.tipo == TIPO_OPERACION.SUMA){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor-valorDer.valor };
        }
        else {
            console.log('Error semantico los tipos no se pueden restar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.MULTIPLICACION){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
        if(valorIzq.tipo == TIPO_DATO.DECIMAL && valorDer.tipo == TIPO_DATO.DECIMAL){
            return { tipo:TIPO_DATO.DECIMAL, valor: valorIzq.valor*valorDer.valor };
        }
        else {
            console.log('Error semantico los tipos no se pueden multiplicar');
            return undefined;
        }
    }
    else if(expresion.tipo == TIPO_OPERACION.DIVISION){
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
        
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        var valorDer = procesarexpresion(expresion.operandoDer, tsglobal, tslocal, metodos);
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
        var valorIzq = procesarexpresion(expresion.operandoIzq, tsglobal, tslocal, metodos);
        
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