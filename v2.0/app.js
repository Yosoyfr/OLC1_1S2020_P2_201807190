//Proceso de las creacion de ventanas
var ctrl_Tabs = 2;
function addWindow() {
  //Obtenemos la lista donde iran los items (tabs)
  let tabs = document.getElementById("myTabs");
  //Obtenemos el div donde se encuentras las referencias de los tabs
  let tabs_Content = document.getElementById("myTabContent");

  //Creamos el nuevo item
  let item = document.createElement("li");
  item.setAttribute("class", "nav-item");

  //Nombre de la pestaña
  let aux_T = document.createTextNode("Pestaña " + ctrl_Tabs);

  //Creamos la referencia de se item
  let reference_Item = document.createElement("a");
  reference_Item.setAttribute("class", "nav-link");
  reference_Item.setAttribute("data-toggle", "tab");
  reference_Item.setAttribute("href", "#p" + ctrl_Tabs);
  reference_Item.setAttribute("onclick", "changeTab('txt" + ctrl_Tabs + "')");
  reference_Item.appendChild(aux_T);
  item.appendChild(reference_Item);

  //Creamos el contenido del tab
  let new_Tab = document.createElement("div");
  new_Tab.setAttribute("class", "tab-pane fade");
  new_Tab.setAttribute("id", "p" + ctrl_Tabs);

  //Creamos el textArea del tab
  let new_TextArea = document.createElement("div");
  new_TextArea.setAttribute(
    "style",
    "width: 722px; height: 270px; position: absolute;"
  );
  new_TextArea.setAttribute("id", "txt" + ctrl_Tabs);

  //Le agremaos el text area al tab
  new_Tab.appendChild(new_TextArea);
  //Le agremas el tab al div de tabs
  tabs_Content.appendChild(new_Tab);

  //Agregamos a la lista de ventanas
  tabs.appendChild(item);

  //Creamos el editor de texto
  let editor = ace.edit("txt" + ctrl_Tabs);
  editor.setTheme("ace/theme/katzenmilch");
  editor.session.setMode("ace/mode/csharp");
  editor.setFontSize("14px");
  //Sumamos una mas
  ctrl_Tabs++;
}

//Seleccion de pestaña
var select_Tab = "txt1";
//Funcion para cambiar la pestaña seleccionada
function changeTab(id) {
  select_Tab = id;
}

//Funcion para el proceso RUN
function run() {
  let editor = ace.edit(select_Tab);
  let value_Txt = editor.getSession().getValue();
  analisis_Lexico(value_Txt);
  console.log(Lista_de_Tokens);
  console.log(Lista_de_Errores);
  parser();
}

//Proceso de analisis lexico

//Lista de Tokens
var Lista_de_Tokens = [];

//lista de errores
var Lista_de_Errores = [];

//Variable booleana que me da lugar a crear el dot
var pasoLibre = true;

//Funcion para el analisis lexico
function analisis_Lexico(entrada) {
  //Inicializamos las listas
  Lista_de_Tokens = [];
  Lista_de_Errores = [];
  let estado = 0;
  let columna = 0;
  let fila = 1;
  let lexema = "";
  let c = "";
  entrada = entrada + " ";
  let contador_Caracter = 0;
  pasoLibre = true;

  //Empezamos el analisis
  for (let i = 0; i < entrada.length; i++) {
    c = entrada[i];
    columna++;
    switch (estado) {
      case 0:
        //Revisara si puede ser una palabra reservada, un caracter o una variable
        if (isLetter(c)) {
          estado = 1;
          lexema += c;
        }
        //Revisara si puede ser un numero
        else if (isDigit(c)) {
          estado = 2;
          lexema += c;
        }
        // Revisara si puede ser una cadena
        else if (c === '"') {
          estado = 5;
          i--;
          columna--;
        }
        //Revisara si puede ser un espacio en blanco
        else if (c === " ") {
          estado = 0;
        }
        //Revisara si puede ser un enter, para cambiar de linea
        else if (c === "\n") {
          columna = 0;
          fila++;
          estado = 0;
        }
        //Revisara si puede ser un caracter
        else if (c == "'") {
          estado = 18;
          i--;
          columna--;
        }
        //Lista de Tokens ya establecidos que son todos los simbolos admitidos
        else if (c === "{") {
          lexema += c;
          addToken("Llave izquierda", lexema, fila, columna);
          lexema = "";
        } else if (c === "}") {
          lexema += c;
          addToken("Llave derecha", lexema, fila, columna);
          lexema = "";
        } else if (c === "[") {
          lexema += c;
          addToken("Corchete izquierdo", lexema, fila, columna);
          lexema = "";
        } else if (c === "]") {
          lexema += c;
          addToken("Corchete derecho", lexema, fila, columna);
          lexema = "";
        } else if (c === "(") {
          lexema += c;
          addToken("Parentesis izquierdo", lexema, fila, columna);
          lexema = "";
        } else if (c === ")") {
          lexema += c;
          addToken("Parentesis derecho", lexema, fila, columna);
          lexema = "";
        } else if (c === ",") {
          lexema += c;
          addToken("Coma", lexema, fila, columna);
          lexema = "";
        } else if (c === ";") {
          lexema += c;
          addToken("Punto y coma", lexema, fila, columna);
          lexema = "";
        } else if (c === "=") {
          estado = 9;
          lexema += c;
        } else if (c === ".") {
          lexema += c;
          addToken("Punto", lexema, fila, columna);
          lexema = "";
        } else if (c === "+") {
          estado = 8;
          lexema += c;
        } else if (c === "-") {
          estado = 10;
          lexema += c;
        } else if (c === "*") {
          lexema += c;
          addToken("Signo por", lexema, fila, columna);
          lexema = "";
        } else if (c === "/") {
          estado = 12;
          lexema += c;
        } else if (c === ":") {
          lexema += c;
          addToken("Dos puntos", lexema, fila, columna);
          lexema = "";
        } else if (c === ">") {
          estado = 11;
          lexema += c;
        } else if (c === "<") {
          estado = 11;
          lexema += c;
        } else if (c === "!") {
          estado = 11;
          lexema += c;
        } else if (c === "|") {
          estado = 16;
          lexema += c;
        } else if (c === "&") {
          estado = 17;
          lexema += c;
        }
        //Si no es ninguno de la lista de tokens, nos devuelve un error
        else {
          estado = -1;
          i--;
          columna--;
        }
        break;
      case 1:
        //Buscara que palabra reservada es
        if (isLetterOrDigit(c) || c === "_") {
          lexema += c;
          estado = 1;
        } else if (lexema === "int") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada int", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "double") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada double", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "char") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada char", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "string" || lexema === "String") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada string", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "bool") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada bool", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "new") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada new", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "Console") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada Console", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "Write") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada Write", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "Class" || lexema === "class") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada class", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "static") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada static", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "void") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada void", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "main") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada main", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "if") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada if", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "else") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada else", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "switch") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada switch", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "case") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada case", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "break") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada break", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "default") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada default", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "for") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada for", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "while") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada while", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "do") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada do", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "return") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada return", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "continue") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada continue", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "true") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada true", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "false") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada false", lexema, fila, columna);
          lexema = "";
        }
        //Si no encuentra resultados, esta palabra es un identificador
        else {
          i--;
          columna--;
          estado = 0;
          addToken("Identificador", lexema, fila, columna);
          lexema = "";
        }
        break;
      case 2:
        //Revisara el numero
        if (isDigit(c)) {
          lexema += c;
          estado = 2;
        } else if (c === ".") {
          lexema += c;
          estado = 3;
        } else {
          i--;
          columna--;
          estado = 0;
          addToken("Numero", lexema, fila, columna);
          lexema = "";
        }
        break;
      case 3:
        if (isDigit(c)) {
          lexema += c;
          estado = 4;
        } else {
          estado = -1;
        }
        break;
      case 4:
        if (isDigit(c)) {
          lexema += c;
          estado = 4;
        } else {
          i--;
          columna--;
          estado = 0;
          addToken("Numero", lexema, fila, columna);
          lexema = "";
        }
        break;
      case 5:
        //Comprueba que es una cadena
        lexema += c;
        estado = 6;
        break;
      case 6:
        //Comprobara todos los datos que contendra la cadena, hasta encontrar otro (") para cerrar la cadena
        if (c == "\n") {
          columna = 0;
          fila++;
          estado = 6;
        } else if (c != '"') {
          lexema += c;
          estado = 6;
        } else {
          estado = 7;
          i--;
          columna--;
        }
        break;
      case 7:
        ///Aqui cierra la cadena al encontrar (")
        lexema += c;
        addToken("Cadena", lexema, fila, columna);
        estado = 0;
        lexema = "";
        break;
      //Sentencias de dobles simbolos
      case 8:
        if (c === "+" && lexema.length < 2) {
          lexema += c;
          estado = 8;
        } else if (lexema === "++") {
          i--;
          columna--;
          estado = 0;
          addToken("Incremento", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "+") {
          i--;
          columna--;
          estado = 0;
          addToken("Signo mas", lexema, fila, columna);
          lexema = "";
        }
        break;
      case 9:
        if (c === "=" && lexema.length < 2) {
          lexema += c;
          estado = 9;
        } else if (lexema === "==") {
          i--;
          columna--;
          estado = 0;
          addToken("Igual igual", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "=") {
          i--;
          columna--;
          estado = 0;
          addToken("Signo igual", lexema, fila, columna);
          lexema = "";
        }
        break;
      case 10:
        if (c === "-" && lexema.length < 2) {
          lexema += c;
          estado = 10;
        } else if (lexema === "--") {
          i--;
          columna--;
          estado = 0;
          addToken("Disminucion", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "-") {
          i--;
          columna--;
          estado = 0;
          addToken("Signo menos", lexema, fila, columna);
          lexema = "";
        }
        break;
      case 11:
        if (c === "=" && lexema.length < 2) {
          lexema += c;
          estado = 11;
        } else if (lexema === ">=") {
          i--;
          columna--;
          estado = 0;
          addToken("Igual o mayor que", lexema, fila, columna);
          lexema = "";
        } else if (lexema === ">") {
          i--;
          columna--;
          estado = 0;
          addToken("Mayor que", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "<=") {
          i--;
          columna--;
          estado = 0;
          addToken("Igual o menor que", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "<") {
          i--;
          columna--;
          estado = 0;
          addToken("Menor que", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "!=") {
          i--;
          columna--;
          estado = 0;
          addToken("Diferente de", lexema, fila, columna);
          lexema = "";
        } else {
          if (lexema === "!") {
            i--;
            columna--;
            estado = 0;
            addToken("Not", lexema, fila, columna);
            lexema = "";
          } else {
            lexema = "";
            i--;
            columna--;
            estado = 0;
          }
        }
        break;
      //Comentarios
      case 12:
        //omprueba que es un comentario
        if (c == "/" || c == "*") {
          lexema += c;
          if (lexema === "//") {
            estado = 15;
          } else if (lexema === "/*") {
            estado = 13;
          } else {
            estado = 12;
          }
        } else if (lexema === "/") {
          i--;
          columna--;
          estado = 0;
          addToken("Signo dividir", lexema, fila, columna);
          lexema = "";
        }
        break;
      case 13:
        //Comprobar que es un comentario multilinea
        if (c == "\n") {
          columna = 0;
          fila++;
          estado = 13;
        } else if (c != "*") {
          lexema += c;
          estado = 13;
        } else {
          estado = 14;
          i--;
          columna--;
        }
        break;
      case 14:
        //Aqui cierra el comentario multilinea
        if (c == "*") {
          lexema += c;
          estado = 14;
        } else if (c != "/") {
          lexema += c;
          estado = 13;
        } else {
          lexema += c;
          addToken("Comentario multilinea", lexema, fila, columna);
          lexema = "";
          columna--;
          estado = 0;
        }
        break;
      case 15:
        ///Aqui cierra el comentario de linea
        if (c == "\n") {
          lexema += c;
          i--;
          estado = 0;
          addToken("Comentario de linea", lexema, fila, columna);
          lexema = "";
        } else if (i == entrada.length - 1) {
          lexema += c;
          i--;
          estado = 0;
          addToken("Comentario de linea", lexema, fila, columna);
          lexema = "";
        } else {
          lexema += c;
          estado = 15;
        }
        break;
      case 16:
        if (c === "|" && lexema.length < 2) {
          lexema += c;
          estado = 16;
        } else if (lexema === "||") {
          i--;
          columna--;
          estado = 0;
          addToken("Or", lexema, fila, columna);
          lexema = "";
        } else {
          if (lexema === "|") {
            i--;
            columna--;
            estado = 0;
            addError("Desconocido", lexema, fila, columna);
            pasoLibre = false;
            lexema = "";
          } else {
            lexema = "";
            i--;
            columna--;
            estado = 0;
          }
        }
        break;
      case 17:
        if (c === "&" && lexema.length < 2) {
          lexema += c;
          estado = 17;
        } else if (lexema === "&&") {
          i--;
          columna--;
          estado = 0;
          addToken("And", lexema, fila, columna);
          lexema = "";
        } else {
          if (lexema === "&") {
            i--;
            columna--;
            estado = 0;
            addError("Desconocido", lexema, fila, columna);
            pasoLibre = false;
            lexema = "";
          } else {
            lexema = "";
            i--;
            columna--;
            estado = 0;
          }
        }
        break;
      case 18:
        //Comprueba que es un caracter lo que viene viendo si es comilla simple
        contador_Caracter = 0;
        if (c == "'") {
          lexema += c;
          estado = 19;
        }
        break;
      case 19:
        //Comprobara el caracter que viene para asignarle y cuando encuentre el otro (') cierra
        if (c != "'") {
          contador_Caracter++;
          lexema += c;
          estado = 19;
        } else if (contador_Caracter < 2) {
          estado = 20;
          i--;
          columna--;
        } else if (contador_Caracter >= 2) {
          estado = 21;
          i--;
          columna--;
        }
        break;
      case 20:
        //Aqui cierra la asignacion del carater
        if (c == "'") {
          lexema += c;
          addToken("Caracter", lexema, fila, columna);
          estado = 0;
          lexema = "";
        }
        break;
      case 21:
        //Comprobara todos los datos que contendra la cadena de HTML, hasta encontrar otro (') para cerrar la cadena
        if (c === "\n") {
          columna = 0;
          fila++;
          estado = 21;
        } else if (c != "'") {
          lexema += c;
          estado = 21;
        } else {
          estado = 22;
          i--;
          columna--;
        }
        break;
      case 22:
        ///Aqui cierra la cadena al encontrar (')
        lexema += c;
        addToken("Cadena html", lexema, fila, columna);
        estado = 0;
        lexema = "";
        break;
      default:
        lexema += c;
        if (
          c === "\n" ||
          c === "\\" ||
          c === "\t" ||
          c === " " ||
          c.charCodeAt(0) === 13 ||
          c.charCodeAt(0) === 9
        ) {
          estado = 0;
          lexema = "";
        } else {
          console.log(c.charCodeAt(0));
          addError("Desconocido", lexema, fila, columna);
          estado = 0;
          lexema = "";
          pasoLibre = false;
        }
        break;
    }
  }
}

//Funcion para saber si es una letra
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

//Funcion para saber si es un numero
function isDigit(str) {
  return str.length === 1 && str.match(/[0-9]/i);
}

//Funcion para saber si es un alfanumerico
function isLetterOrDigit(str) {
  return str.length === 1 && str.match(/[0-9a-z]/i);
}

//Funcion para añadir a la lista de tokens
function addToken(tipo, lexema, fila, columna) {
  Lista_de_Tokens.push({
    Tipo: tipo,
    Lexema: lexema,
    Fila: fila,
    Columna: columna,
  });
}

//Funcion para añadir a la lista de errores
function addError(tipo, lexema, fila, columna) {
  Lista_de_Errores.push({
    Tipo: tipo,
    Lexema: lexema,
    Fila: fila,
    Columna: columna,
  });
}

//Proceso de analisis sintactico

//Variable que se usa como indice para recorrer la lista de tokens
var indice = 0;

//Variable que representa el caracter de anticipacion que posee el parser para ralizar el analisis, en este caso se desarrollo un analizador LL1 (analizador predictivorecursivo), con solo un caracter(token) de anticipacion.
var tokenActual;

//Codigo de traduccion python
var Codigo_Python = "";
//Contador de Tabs
var Contador_Tabs_Python = 0;

//Lista de tokens que el parser recibe del analizador lexico
var ListaVariablesGlobales = [];
var Lista_Errores_Sintaticos = [];

//Funcion del parser
function parser() {
  //Vamos a añadir un ultimo token para saber donde termina
  addToken("Ultimo", "Ultimo", "0", "0");
  //Reiniciamos las listas
  ListaVariablesGlobales = [];
  Lista_Errores_Sintaticos = [];
  //Reiniamos todos los valores
  indice = 0;
  tokenActual = Lista_de_Tokens[indice];

  //Llamada al no terminal inicial
  I();
}

function I() {
  //Inicio de un documento c#
  //Puede que vengan comentarios
  Comentarios();
  //Vamos a hacer esto de forma que si viene una clase o no
  let class_ = false;
  if (tokenActual.Tipo == "Reservada class") {
    emparejar("Reservada class");
    emparejar("Identificador");
    emparejar("Llave izquierda");
    class_ = true;
  }
  //Cuerpo de las sentencias y codigos del documento c#
  /*
   * <Inicio> -> <Asignacion de Variables>
   *          | <Ciclos>
   *          | <
   */
  Inicio();

  //Final de un documento c#
  // si se encontro que venia una clase tiene que terminar de esta manera
  if (class_) {
    emparejar("Llave derecha");
  } else {
    console.log(
      ">> Error sintactico se esperaba [" +
        tip +
        "] en lugar de [" +
        tokenActual.Tipo +
        ", " +
        tokenActual.Lexema +
        ", " +
        tokenActual.Fila +
        "]"
    );
    errorSintactico = true;
    Error_Sintactico_Permiso = false;
  }
}

// Metodo que sirve para leer los valores a las variables
var valorVariable = "";
var Variables_Python = [];

function Inicio() {
  asignacionVariables();
  Condicionales();
  Ciclos();
  instruccionImprimir();
}

//Aqui es donde se le agrega un valor a la asignacion que se le hizo a la variable declarada o variables.
function Asignacion_Expresion() {
  valorVariable = "";
  Expresiones();
}

//Comparacaion de mas expresiones
function Expresiones() {
  //Expresiones-> T EP
  T();
  EP();
}

function EP() {
  //EP-> + T EP
  //   | - T EP
  //   | Epsilon
  if (tokenActual.Tipo === "Signo mas") {
    valorVariable += "+";
    emparejar("Signo mas");
    T();
    EP();
  } else if (tokenActual.Tipo === "Signo menos") {
    valorVariable += "-";
    emparejar("Signo menos");
    T();
    EP();
  } else {
    // Epsilon
    // Quiere decir que no viene ninguno de los simbolos de suma o resta
  }
}

function T() {
  // T-> F TP
  F();
  TP();
}

function TP() {
  //TP-> * F TP
  //   | / F TP
  //   | Epsilon
  if (tokenActual.Tipo === "Signo por") {
    valorVariable += "*";
    emparejar("Signo por");
    F();
    TP();
  } else if (tokenActual.Tipo === "Signo dividr") {
    valorVariable += "/";
    emparejar("Signo dividr");
    F();
    TP();
  } else {
    // Epsilon
    // Quiere decir que no viene ninguno de los simbolos de multiplicacion o division
  }
}

//Variable que compara el analisis semantico de que el valor de las variables sea el adecuado en la asignacion
var Error_Semantico_Tipo_Asignacion = false;

function F() {
  //F->  (Expresiones)
  //  | Numero
  //  | Caracter
  //  | Cadena
  //  | True
  //  | False

  if (tokenActual.Tipo === "Parentesis izquierdo") {
    valorVariable += "(";
    emparejar("Parentesis izquierdo");
    Expresiones();
    valorVariable += ")";
    emparejar("Parentesis derecho");
  } else if (tokenActual.Tipo === "Numero") {
    valorVariable += tokenActual.Lexema;
    emparejar("Numero");
  } else if (tokenActual.Tipo === "Cadena") {
    valorVariable += tokenActual.Lexema;
    emparejar("Cadena");
  } else if (tokenActual.Tipo === "Reservada true") {
    valorVariable += tokenActual.Lexema;
    emparejar("Reservada true");
  } else if (tokenActual.Tipo === "Reservada false") {
    valorVariable += tokenActual.Lexema;
    emparejar("Reservada false");
  }else else if (tokenActual.Tipo === "Caracter") {
    valorVariable += tokenActual.Lexema;
    emparejar("Caracter");
  }
}

/*Tomado del GitHub de Yela y GitLab de Elmer para crear perfecto emparejar xd
 * A continuación se programa el metodo emparejar(match)
 *
 * Este metodo compara la entradda en la lista de tokens, es decir el tokenActual con lo que deberia
 * venir, que es lo que se pasa como parametro, es decir "tip".
 *
 * Si "lo que viene" no es igual a "lo que deberia de venir", entonces se reporta el error,
 * de lo contrario si no hemos llegado al final de la lista de tokens pasamos a analizar el
 * siguiente token.
 */
var errorSintactico = false;
var Error_Sintactico_Permiso = true;
function emparejar(tip) {
  if (errorSintactico) {
    Error_Sintactico_Permiso = false;
    if (tokenActual.Tipo != "Ultimo") {
      indice++;
      tokenActual = Lista_de_Tokens[indice];
      if (tokenActual.Tipo === "Punto y coma") {
        errorSintactico = false;
      }
    }
  } else {
    if (tokenActual.Tipo === tip) {
      indice++;
      tokenActual = Lista_de_Tokens[indice];
    } else {
      console.log(
        ">> Error sintactico se esperaba [" +
          tip +
          "] en lugar de [" +
          tokenActual.Tipo +
          ", " +
          tokenActual.Lexema +
          ", " +
          tokenActual.Fila +
          "]"
      );
      errorSintactico = true;
    }
  }
}
