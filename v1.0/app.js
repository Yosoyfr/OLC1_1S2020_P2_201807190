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
  let new_TextArea = document.createElement("textarea");
  new_TextArea.setAttribute("class", "form-control");
  new_TextArea.setAttribute("id", "txt" + ctrl_Tabs);
  new_TextArea.setAttribute("rows", "11");

  //Le agremaos el text area al tab
  new_Tab.appendChild(new_TextArea);
  //Le agremas el tab al div de tabs
  tabs_Content.appendChild(new_Tab);

  //Agregamos a la lista de ventanas
  tabs.appendChild(item);

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
  let contect_Txt = document.getElementById(select_Tab).value;
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
        //Revisara si puede ser un caracter
        else if (c === "'") {
          estado = 16;
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
            pasoLibre = false;
            addError("Desconocido", lexema, fila, columna);
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
      default:
        lexema += c;
        if (c === "\n" || c === "\\" || c === "\t" || c === " " || c == 13) {
          estado = 0;
          lexema = "";
        } else {
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
function addError(tipo, lexema, descripcion, fila, columna) {
  Lista_de_Errores.push({
    Tipo: tipo,
    Lexema: lexema,
    Fila: fila,
    Columna: columna,
  });
}

analisis_Lexico("double suma(double n1, double n2){return n1 + n2;}");
console.log(Lista_de_Tokens);
console.log(Lista_de_Errores);
