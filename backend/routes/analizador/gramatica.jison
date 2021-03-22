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

\"[^\"]*\"                  { yytext = yytext.substr(1, yyleng-2); return 'cadenaa'; }
[0-9]+("."[0-9]+)?\b        return 'decimall';
([a-zA-Z])[a-zA-Z0-9_]*     return 'identificador';

<<EOF>>                 return 'EOF';

.           {console.log('Error Lexico: '+yytext+' en la linea' + yylloc.first_line + ' en la columna '+yylloc.first_column); }

/lex

%{

%}

// Precedencia de operadores
%left 'mas' 'menos'
%left 'por' 'dividido'
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
    | TIPO identificador pcoma;

IMPRIMIR
    : imprimir menor menor EXP pcoma;

TIPO
    : decimal
    | cadena
    | bandera;

EXP
    : EXP mas EXP
    | EXP menos EXP
    | EXP por EXP
    | EXP dividido EXP
    | menos EXP
    | parentesisa EXP parentesisc
    | decimall
    | cadenaa
    | truee
    | falsee
    | identificador;