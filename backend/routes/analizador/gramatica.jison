/* Analizador Lexico */

%lex

%options case-insensitive

%%

\s+                                         //Se ignoran espacios
"//".*                                      //Comentario unilinea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]         //Comentario multilinea

"decimal"               return 'decimal';
"cadena"                return 'cadena';
"bandera"               return 'bandera';
";"                     return 'pcoma';
"-"                     return 'menos';
"+"                     return 'mas';
"*"                     return 'por';
"/"                     return 'dividido';
"<"                     return 'menor';
"true"                  return 'truee';
"false"                 return 'falsee';
"cout"                  return 'imprimir';
"("                     return 'parentesisa';
")"                     return 'parentesisc';
"?"                     return 'signointerrogacion';
":"                     return 'dospuntos';

\"[^\"]*\"                  { yytext = yytext.substr(1, yyleng-2); return 'cadenaa'; }
[0-9]+("."[0-9]+)?\b        return 'decimall';
([a-zA-Z])[a-zA-Z0-9_]*     return 'identificador';

<<EOF>>                 return 'EOF';

.           {console.log('Error Lexico: '+yytext+' en la linea' + yylloc.first_line + ' en la columna '+yylloc.first_column); }

/lex

%{
    const TIPO_OPERACION = require('../arbol/instrucciones').TIPO_OPERACION;
    const TIPO_VALOR = require('../arbol/instrucciones').TIPO_VALOR;
    const INSTRUCCIONES = require('../arbol/instrucciones').INSTRUCCIONES;
    const TIPO_DATO = require('../arbol/tablasimbolos').TIPO_DATO;
%}

// Precedencia de operadores
%left 'signointerrogacion'
%left 'mas' 'menos'
%left 'por' 'dividido'
%right UCASTEO
%left UMENOS

%start INICIO

%% /* Gramatica */

INICIO
    : CUERPO EOF { console.log('Funciono'); };

CUERPO
    : CUERPO DECLARACION
    | CUERPO IMPRIMIR
    | DECLARACION
    | IMPRIMIR;

DECLARACION
    : TIPO identificador menor menos EXP pcoma
    | TIPO identificador pcoma ;

IMPRIMIR
    : imprimir menor menor EXP pcoma { $$=INSTRUCCIONES.nuevoImprimir($4); };

TIPO
    : decimal                           { $$ = TIPO_DATO.DECIMAL; }
    | cadena                            { $$ = TIPO_DATO.CADENA; }
    | bandera                           { $$ = TIPO_DATO.BANDERA; };

CASTEO
    : parentesisa TIPO parentesisc EXP %prec UCASTEO;

EXP
    : EXP mas EXP                       { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.SUMA, $1, $3); }
    | EXP signointerrogacion EXP dospuntos EXP
    | CASTEO
    | EXP menos EXP                     { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.RESTA, $1, $3); }
    | EXP por EXP                       { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.MULTIPLICACION, $1, $3); }
    | EXP dividido EXP                  { $$ = INSTRUCCIONES.nuevaOperacionBinaria(TIPO_OPERACION.DIVISION, $1, $3); }
    | menos EXP %prec UMENOS            { $$ = INSTRUCCIONES.nuevaOperacionUnaria(TIPO_OPERACION.NEGATIVO, $2); }
    | parentesisa EXP parentesisc       { $$ = $2 }
    | decimall                          { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.DECIMAL, Number($1)); }
    | cadenaa                           { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.CADENA, $1); }
    | truee                             { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.BANDERA, true); }
    | falsee                            { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.BANDERA, false); }
    | identificador                     { $$ = INSTRUCCIONES.nuevoValor(TIPO_VALOR.IDENTIFICADOR, $1); };