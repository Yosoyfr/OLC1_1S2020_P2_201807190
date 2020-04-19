//Archivos abiertos en las pestañas
var Archivos_Abiertos = [];
//Proceso para la lectura de archivos
function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function (e) {
    var contenido = e.target.result;
    mostrarContenido(contenido, archivo.name);
  };
  lector.readAsText(archivo);
}

function mostrarContenido(contenido, name) {
  //Creamos la pestaña
  addWindow();
  //Seleccionamos el texto de la pestaña seleccionada
  let editor = ace.edit("txt" + (ctrl_Tabs - 1));
  //Le asignamos lo leido
  editor.getSession().setValue(contenido);
  //Guardamos en nuestra lista de archivos abiertos
  addFilesOpen("txt" + (ctrl_Tabs - 1), name);
}

//Funcion para añadir a la lista de tokens
function addFilesOpen(tab, nombre) {
  Archivos_Abiertos.push({
    Tab: tab,
    Nombre: nombre,
  });
}

//Le asignamos el metodo al boton de abrir
const openDocs = document.getElementById("file-input");
openDocs.addEventListener("change", leerArchivo, false);

//Proceso para guardar archivos
function saveFiles() {
  let existFile = false;
  let aux_Nombre = "";
  for (let i = 0; i < Archivos_Abiertos.length; i++) {
    if (select_Tab === Archivos_Abiertos[i].Tab) {
      existFile = true;
      aux_Nombre = Archivos_Abiertos[i].Nombre;
    }
  }
  //Seleccionamos el texto de la pestaña seleccionada
  let editor = ace.edit(select_Tab);
  let value_Txt = editor.getSession().getValue();
  if (existFile) {
    saveDocument(value_Txt, aux_Nombre);
  } else {
    $("#modal-save").modal("show");
  }
}

function saveDocument(value_Txt, aux_Nombre) {
  let file = new File([value_Txt], aux_Nombre, {
    type: "text/plain;charset=utf-8",
  });
  // obtienes una URL para el fichero que acabas de crear
  var url = window.URL.createObjectURL(file);
  // creas un enlace y lo añades al documento
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";

  // actualizas los parámetros del enlace para descargar el fichero creado
  a.href = url;
  a.download = file.name;
  a.onclick = destroyClickedElement;
  a.click();
  window.URL.revokeObjectURL(url);
}

function destroyClickedElement(event) {
  // remove the link from the DOM
  document.body.removeChild(event.target);
}

//Proceso guardar como
function SaveAs() {
  let aux_Nombre = document.getElementById("nombre-file").value;
  let editor = ace.edit(select_Tab);
  let value_Txt = editor.getSession().getValue();
  saveDocument(value_Txt, aux_Nombre);
  $("#modal-save").modal("hide");
  document.getElementById("nombre-file").value = "text.cs";
}

//Funcion para abrir archivos en el navegador
function openFiles(file) {
  // obtienes una URL para el fichero que acabas de crear
  var url = window.URL.createObjectURL(file);
  window.open(url, "Download");
}

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
  new_TextArea.setAttribute("class", "list-group");
  new_TextArea.setAttribute("style", "height: 330px; position: relative;");
  new_TextArea.setAttribute("id", "txt" + ctrl_Tabs);

  //Le agremaos el text area al tab
  new_Tab.appendChild(new_TextArea);
  //Le agremas el tab al div de tabs
  tabs_Content.appendChild(new_Tab);

  //Agregamos a la lista de ventanas
  tabs.appendChild(item);

  //Creamos el editor de texto
  let editor = ace.edit("txt" + ctrl_Tabs);
  editor.setTheme("ace/theme/cobalt");
  editor.session.setMode("ace/mode/csharp");
  editor.setFontSize("14px");
  //Sumamos una mas
  ctrl_Tabs++;
}

function addTable() {
  //Obtenemos la tabla
  let table = document.getElementById("table_var");
  for (let i = 0; i < ListaVariables.length; i++) {
    //Creamos el nuevo renglon
    let tr = document.createElement("tr");
    tr.setAttribute("class", "table-active");
    //Creamos las divisiones
    //Tipo
    let aux_Tipo = document.createTextNode(ListaVariables[i].Tipo);
    let th_Tipo = document.createElement("th");
    th_Tipo.setAttribute("scope", "row");
    th_Tipo.appendChild(aux_Tipo);
    //Nombre
    let aux_Nombre = document.createTextNode(ListaVariables[i].Identificador);
    let td_Nombre = document.createElement("td");
    td_Nombre.appendChild(aux_Nombre);
    //Linea
    let aux_Linea = document.createTextNode(ListaVariables[i].Fila);
    let td_Linea = document.createElement("td");
    td_Linea.appendChild(aux_Linea);
    //Le agremamos cada division al renglon
    tr.appendChild(th_Tipo);
    tr.appendChild(td_Nombre);
    tr.appendChild(td_Linea);
    //Añadimos el renglon a la tabla
    table.appendChild(tr);
  }
}

//Seleccion de pestaña
var select_Tab = "txt1";
//Funcion para cambiar la pestaña seleccionada
function changeTab(id) {
  select_Tab = id;
}

//Archivo python
var file_python;
//Funcion para el proceso RUN
function run() {
  //Limpiamos los files
  file_html = null;
  file_python = null;
  file_json = null;
  html_print = "";
  pasoLibre = true;
  //Obtenemos la tabla
  let table = document.getElementById("table_var");
  //Limpiamos la tabla
  $(table).empty();
  //Seleccionamos el texto de la pestaña seleccionada
  let editor = ace.edit(select_Tab);
  let value_Txt = editor.getSession().getValue();
  //Empezamos con el analisis lexico
  analisis_Lexico(value_Txt);
  //console.log(Lista_de_Tokens);
  //Empezamos con el analisis sintactico
  parser();
  if (Error_Sintactico_Permiso) {
    //Creamos la tabla de variables
    addTable();
    //Obteneos la traduccion
    var Console_ = ace.edit("console");
    //Le asignamos lo leido
    Console_.getSession().setValue(Codigo_Python);
    //Creamos el archivo python
    //Creamos el archivo html
    file_python = new File([Codigo_Python], "Reporte_python.py", {
      type: "text/plain;charset=utf-8",
    });
    //Analizamos el codigo html
    readHTML();
  }
  if (!pasoLibre || Lista_Errores_Sintaticos.length > 0) {
    ErrorAnalisis("Existen errores");
    console.log(Lista_Errores_Sintaticos);
    console.log(Lista_de_Errores);
    printErrores();
  }
}

//Proceso de errores
function ErrorAnalisis(alerta) {
  //Obtenemos la modal_alert
  let modal = document.getElementById("modal_alert");
  //Limpiamos la modal_alert
  $(modal).empty();
  //Creamos el texto de la alerta
  let aux_Alerta = document.createTextNode(alerta);
  modal.appendChild(aux_Alerta);
  $("#alertModal").modal("show");
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
          addToken("Reservada console", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "Write") {
          i--;
          columna--;
          estado = 0;
          addToken("Reservada write", lexema, fila, columna);
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
          i--;
          columna--;
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
          lexema += "\n";
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
var Lista_Errores_Sintaticos = [];

//Funcion del parser
function parser() {
  //Vamos a añadir un ultimo token para saber donde termina
  addToken("Ultimo", "Ultimo", "0", "0");
  //Reiniciamos las listas
  ListaVariables = [];
  Lista_Errores_Sintaticos = [];
  //Reiniamos todos los valores
  indice = 0;
  tokenActual = Lista_de_Tokens[indice];
  errorSintactico = false;
  Error_Sintactico_Permiso = true;
  isVoid = false;
  //Codigo traducido python
  Contador_Tabs_Python = 0;
  Codigo_Python = "";
  //Llamada al no terminal inicial
  Inicio();
}

function addErrorSintactico(esperado, encontrado, fila, columna) {
  Lista_Errores_Sintaticos.push({
    Esperado: esperado,
    Encontrado: encontrado,
    Fila: fila,
    Columna: columna,
  });
}

function Inicio() {
  //Inicio de un documento c#
  //Puede que vengan comentarios
  ComentariosGlobales();
  //Vamos a hacer esto de forma que si viene una clase o no

  emparejar("Reservada class");
  emparejar("Identificador");
  emparejar("Llave izquierda");
  //Cuerpo de las sentencias y codigos del documento c#
  Declaracion_Cont();

  //Final de un documento c#
  emparejar("Llave derecha");

  ComentariosGlobales();
}

//<Declaracion_Cont>:= <Metodos> <Declaracion_Cont>
//                  | <Declaracion_Var>
function Declaracion_Cont() {
  Lista_Declaracion();
  //Codigo_Python += "\n";
  Metodos();
  ComentariosMet();
}

var mainPerm = true;

function Metodos() {
  if (tokenActual.Tipo === "Reservada void") {
    emparejar("Reservada void");
    Codigo_Python += "def ";
    if (mainPerm && tokenActual.Tipo === "Reservada main") {
      Main();
      Declaracion_Cont();
    } else {
      Metodo_Void();
      Declaracion_Cont();
    }
  }
}

function Sentencias() {
  Lista_Declaracion();
  Comentarios();
  Imprimir();
  Condicionales();
  Ciclos();
}

//Variable que sirve para saber que es un ciclo
var esCiclo = 0;

function Ciclos() {
  //<Ciclos> -> <For>
  //         | <While>
  //         | <Do_While>
  if (tokenActual.Tipo === "Reservada for") {
    esCiclo++;
    Ciclo_For();
    Sentencias();
    esCiclo--;
  } else if (tokenActual.Tipo === "Reservada while") {
    esCiclo++;
    Ciclo_While();
    Sentencias();
    esCiclo--;
  } else if (tokenActual.Tipo === "Reservada do") {
    esCiclo++;
    Ciclo_Do_While();
    Sentencias();
    esCiclo--;
  }
}

function Continue() {
  //Si viene o no el continue
  if (tokenActual.Tipo === "Reservada continue") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python += "continue\n";
    emparejar("Reservada continue");
    emparejar("Punto y coma");
  }
}

function Break() {
  //Si viene o no el break
  if (tokenActual.Tipo === "Reservada break") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python += "break\n";
    emparejar("Reservada break");
    emparejar("Punto y coma");
  }
}

function Ciclo_Do_While() {
  //<Do_While> -> Do { <Sentencias> } while ( <Expresion> ) ;
  valorVariable = "";
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  Codigo_Python += "while True:" + "\n";
  Contador_Tabs_Python++;
  emparejar("Reservada do");
  emparejar("Llave izquierda");
  Sentencias();
  Break();
  emparejar("Llave derecha");
  emparejar("Reservada while");
  emparejar("Parentesis izquierdo");
  Expresiones();
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  Codigo_Python += "if (" + valorVariable + "):\n";
  Contador_Tabs_Python++;
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  Codigo_Python += "break\n";
  Contador_Tabs_Python--;
  emparejar("Parentesis derecho");
  emparejar("Punto y coma");
  Contador_Tabs_Python--;
}

function Ciclo_While() {
  //<While> -> while ( <Expresion> ) { <Sentencias> }
  valorVariable = "";
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  emparejar("Reservada while");
  emparejar("Parentesis izquierdo");
  Expresiones();
  Codigo_Python += "while " + valorVariable + " :\n";
  Contador_Tabs_Python++;
  emparejar("Parentesis derecho");
  emparejar("Llave izquierda");
  Sentencias();
  Break();
  emparejar("Llave derecha");
  Contador_Tabs_Python--;
}

//Variables para el for
var for_var = "";
var lenght_Var_For = 0;

function Ciclo_For() {
  //<For> -> for ( <Declaracion> ; <Expresion> ;  Alter) { <Sentencias> }
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  Codigo_Python += "for ";
  emparejar("Reservada for");
  emparejar("Parentesis izquierdo");
  valorVariable = "";
  Declaracion_Var();
  Codigo_Python = Codigo_Python.substring(
    0,
    Codigo_Python.length - lenght_Var_For
  );
  Codigo_Python += for_var + " in range (" + valorVariable;
  valorVariable = "";
  if (tokenActual.Lexema === for_var) {
    emparejar("Identificador");
    Simbolo_For();
    Expresiones();
  } else {
    Expresiones();
    Simbolo_For();
    emparejar("Identificador");
  }
  emparejar("Punto y coma");
  Alter_Ciclos();
  emparejar("Parentesis derecho");
  emparejar("Llave izquierda");
  Codigo_Python += ", " + valorVariable + "):\n";
  Contador_Tabs_Python++;
  Sentencias();
  Break();
  emparejar("Llave derecha");
  Contador_Tabs_Python--;
}

function Simbolo_For() {
  //Simbolo_For-> <
  //   | >
  //   | ==
  //   | !=
  //   | >=
  //   | <=
  if (tokenActual.Tipo === "Menor que") {
    emparejar("Menor que");
  } else if (tokenActual.Tipo === "Mayor que") {
    emparejar("Mayor que");
  } else if (tokenActual.Tipo === "Igual igual") {
    emparejar("Igual igual");
  } else if (tokenActual.Tipo === "Diferente de") {
    emparejar("Diferente de");
  } else if (tokenActual.Tipo === "Igual o mayor que") {
    emparejar("Igual o mayor que");
  } else {
    emparejar("Igual o menor que");
  }
}

function Alter_Ciclos() {
  emparejar("Identificador");
  if (tokenActual.Tipo === "Disminucion") {
    emparejar("Disminucion");
  } else {
    emparejar("Incremento");
  }
}

function Condicionales() {
  valorVariable = "";
  //<Condicionales> -> <If> <Else> <Sentencias>
  //                 | <Switch> <Sentencias>
  //                 | Epsilon
  if (tokenActual.Tipo === "Reservada if") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    If();
    Else();
    Sentencias();
    //Codigo_Python += "\n";
  } else if (tokenActual.Tipo === "Reservada switch") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Switch();
    Sentencias();
  }
}

function Switch() {
  //<Switch> -> switch ( ID ) { <Cases> <Defaul> }
  valorVariable = "";
  emparejar("Reservada switch");
  emparejar("Parentesis izquierdo");
  Contador_Tabs_Python++;
  Expresiones();
  Codigo_Python += "def switch (case, " + valorVariable + "):\n";
  emparejar("Parentesis derecho");
  emparejar("Llave izquierda");
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  Codigo_Python += "switcher = {" + "\n";
  Contador_Tabs_Python++;
  Cases();
  Default();
  emparejar("Llave derecha");
  Contador_Tabs_Python--;
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  Codigo_Python += "}" + "\n";
  Contador_Tabs_Python--;
}

function Cases() {
  //<Cases> -> case numero : <CasesP>
  //        | Epsilon
  valorVariable = "";
  if (tokenActual.Tipo === "Reservada case") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    emparejar("Reservada case");
    aux_Default = tokenActual.Lexema;
    Expresiones();
    Codigo_Python += valorVariable + ":";
    emparejar("Dos puntos");
    CasesP();
  }
}

//Variable auxiliar del default
var aux_Default = 0;

function CasesP() {
  //<Cases> -> <Cases>
  //        | <Sentencias> break ;
  if (tokenActual.Tipo === "Reservada case") {
    Cases();
  } else {
    //Codigo del bloque del case (num) o de varios cases
    Sentencias();
    if (tokenActual.Tipo === "Reservada break") {
      emparejar("Reservada break");
      emparejar("Punto y coma");
    }
    Codigo_Python = Codigo_Python.slice(0, -1);
    Codigo_Python += ", " + "\n";
    Cases();
  }
}

function Default() {
  //<Default> -> default : <Sentencias> break ;
  //        | Epsilon
  if (tokenActual.Tipo === "Reservada default") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python += "default" + ":";
    emparejar("Reservada default");
    emparejar("Dos puntos");
    //Codigo del bloque del default
    Sentencias();
    emparejar("Reservada break");
    emparejar("Punto y coma");
    Codigo_Python = Codigo_Python.slice(0, -1);
    Codigo_Python += ", " + "\n";
  }
}

function If() {
  //<If> -> if ( <Expresiones> ) { <Sentencias> }
  //El condicional encontrado es el IF
  valorVariable = "";
  emparejar("Reservada if");
  emparejar("Parentesis izquierdo");
  //Condicional que hace cumplir o no el if
  Expresiones();
  emparejar("Parentesis derecho");
  emparejar("Llave izquierda");
  Codigo_Python += "if " + valorVariable + ":\n";
  Contador_Tabs_Python++;
  //Codigo del bloque del if
  Sentencias();
  if (tokenActual.Tipo === "Reservada return") {
    Return();
  } else if (tokenActual.Tipo === "Reservada break" && esCiclo > 0) {
    Break();
  } else if (tokenActual.Tipo === "Reservada continue" && esCiclo > 0) {
    Continue();
  }
  emparejar("Llave derecha");
  Contador_Tabs_Python--;
}

function Else() {
  //<Else> -> else <ElseP>
  //        | Epsilon
  if (tokenActual.Tipo === "Reservada else") {
    emparejar("Reservada else");
    //Miramos si es un else normal o si no un else if
    ElseP();
  }
}

function ElseP() {
  //<ElseP> -> <If>
  //       | { <Sentencias> }
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  if (tokenActual.Tipo === "Reservada if") {
    Codigo_Python += "el";
    If();
    Else();
  } else {
    Codigo_Python += "else:\n";
    Contador_Tabs_Python++;
    emparejar("Llave izquierda");
    //Codigo del bloque del if
    Sentencias();
    if (tokenActual.Tipo === "Reservada return") {
      Return();
    } else if (tokenActual.Tipo === "Reservada break" && esCiclo > 0) {
      Break();
    } else if (tokenActual.Tipo === "Reservada continue" && esCiclo > 0) {
      Continue();
    }
    Contador_Tabs_Python--;
    emparejar("Llave derecha");
  }
}

function Return() {
  valorVariable = "";
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  emparejar("Reservada return");
  if (tokenActual.Tipo != "Punto y coma") {
    Expresiones();
    Codigo_Python += "return " + valorVariable + "\n";
    emparejar("Punto y coma");
  } else {
    Codigo_Python += "return " + "\n";
    emparejar("Punto y coma");
  }
}

function Imprimir() {
  //<Imprimir> -> Console . Write ( <Expresion> ) ;
  valorVariable = "";
  if (tokenActual.Tipo === "Reservada console") {
    emparejar("Reservada console");
    emparejar("Punto");
    emparejar("Reservada write");
    emparejar("Parentesis izquierdo");
    //Expresion a imprimir
    if (tokenActual.Tipo === "Cadena html") {
      html_print += tokenActual.Lexema.substring(
        1,
        tokenActual.Lexema.length - 1
      );
    }
    Expresiones();
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python += "print(" + valorVariable + ")" + "\n";
    emparejar("Parentesis derecho");
    emparejar("Punto y coma");
    Sentencias();
  } else {
    //Ya no vienen mas instrucciones de imprimir con lo que saldremos del metodo
  }
}

function Lista_Declaracion() {
  if (
    tokenActual.Tipo.match(
      /^(Reservada int|Reservada double|Reservada string|Reservada char|Reservada bool|Identificador)$/
    )
  ) {
    Declaracion_Var();
    Lista_Declaracion();
  } else {
    //Ya no hay mas declaraciones
  }
}

var cont_Var = 0;
var express_ = "";

function Declaracion_Var() {
  express_ = "";
  //<Declaracion_Var> -> <Asignacion_de_tipo>_<Lista ID> <Opcion_de_Asignacion> PuntoyComa
  cont_Var = 0;
  if (
    tokenActual.Tipo.match(
      /^(Reservada int|Reservada double|Reservada string|Reservada char|Reservada bool)$/
    )
  ) {
    Asignacion_de_Tipo();
    Lista_ID();
    //Esto es por si puede ser una funcion
    if (cont_Var === 1 && tokenActual.Tipo === "Parentesis izquierdo") {
      emparejar("Parentesis izquierdo");
      //Aqui esta la traduccion para funciones
      //-------------------------------------------------
      Codigo_Python += "def " + Lista_Var_Python[0].Lexema + " (";
      Contador_Tabs_Python++;
      if (tokenActual.Tipo != "Parentesis derecho") {
        Parametros();
        emparejar("Parentesis derecho");
      } else {
        emparejar("Parentesis derecho");
      }
      Codigo_Python += "):" + "\n";
      emparejar("Llave izquierda");
      Sentencias();
      emparejar("Reservada return");
      Expresiones();
      for (let j = 0; j < Contador_Tabs_Python; j++) {
        Codigo_Python += "  ";
      }
      Codigo_Python += "return " + valorVariable + "\n";
      emparejar("Punto y coma");
      emparejar("Llave derecha");
      Contador_Tabs_Python--;
      Codigo_Python += "\n";
    } else {
      Opcion_Asignacion();
      emparejar("Punto y coma");
    }
  } else if (tokenActual.Tipo === "Identificador") {
    str_Var = "";
    temp_variable = "";
    for (let i = 0; i < ListaVariables.length; i++) {
      if (ListaVariables[i].Identificador === tokenActual.Lexema) {
        temp_variable = ListaVariables[i].Tipo;
      }
    }
    Lista_ID();
    express_ = for_var;
    if (
      cont_Var === 1 &&
      tokenActual.Tipo.match(/^(Disminucion|Incremento)$/)
    ) {
      Alter();
      emparejar("Punto y coma");
      for (let j = 0; j < Contador_Tabs_Python; j++) {
        Codigo_Python += "  ";
      }
      Codigo_Python += express_ + "\n";
    } else if (cont_Var === 1 && tokenActual.Tipo === "Parentesis izquierdo") {
      IDP();
      express_ += valorVariable + "\n";
      for (let j = 0; j < Contador_Tabs_Python; j++) {
        Codigo_Python += "  ";
      }
      Codigo_Python += express_;
      emparejar("Punto y coma");
    } else {
      Opcion_Asignacion();
      emparejar("Punto y coma");
    }
  }
}

function Alter() {
  if (tokenActual.Tipo === "Disminucion") {
    express_ += "--";
    emparejar("Disminucion");
  } else {
    express_ += "++";
    emparejar("Incremento");
  }
}

function Lista_ID() {
  Lista_Var_Python = [];
  valorVariable = "";
  //< Lista ID > -> ID(Variable) <Lista ID'>
  if (Lista_de_Tokens[indice + 1].Lexema != "(") {
    if (temp_variable === "") {
      temp_variable = "No identificado";
    }
    addVar(temp_variable, tokenActual.Lexema, tokenActual.Fila);
  }
  Lista_Var_Python.push(tokenActual);
  for_var = tokenActual.Lexema;
  emparejar("Identificador");
  cont_Var++;
  Lista_ID_1();
}

function Lista_ID_1() {
  //<Lista ID_1> -> Coma ID(Variable) <Lista ID'>
  //             | Epsilon
  if (tokenActual.Tipo === "Coma") {
    emparejar("Coma");
    if (Lista_de_Tokens[indice + 1].Lexema != "(") {
      if (temp_variable === "") {
        temp_variable = "Tipo no identificado";
      }
      addVar(temp_variable, tokenActual.Lexema, tokenActual.Fila);
    }
    Lista_Var_Python.push(tokenActual);
    emparejar("Identificador");
    cont_Var++;
    Lista_ID_1();
  }
}

//Lista de variables
var ListaVariables = [];

//Variable que sirve como tipo de asignacion a comparar
/*
 * int = 0
 * string = 1
 * char = 2
 * float = 3
 * bool = 4
 */

var tipo_variable = 0;
var temp_variable = "";

//lista de variables python
var Lista_Var_Python = [];

//Var si fue declarado
var str_Var = "";

function Asignacion_de_Tipo() {
  str_Var = "var ";
  if (tokenActual.Tipo === "Reservada int") {
    //<Declaracion_Var> -> int <Lista ID> <Opcion_de_Asignacion> PuntoyComa
    emparejar("Reservada int");
    tipo_variable = 0;
    temp_variable = "int";
  } else if (tokenActual.Tipo === "Reservada string") {
    //<Declaracion_Var> -> string <Lista ID> <Opcion_de_Asignacion> PuntoyComa
    emparejar("Reservada string");
    tipo_variable = 1;
    temp_variable = "string";
  } else if (tokenActual.Tipo === "Reservada char") {
    //<Declaracion_Var> -> char <Lista ID> <Opcion_de_Asignacion> PuntoyComa
    emparejar("Reservada char");
    tipo_variable = 2;
    temp_variable = "char";
  } else if (tokenActual.Tipo === "Reservada double") {
    //<Declaracion_Var> -> float <Lista ID> <Opcion_de_Asignacion> PuntoyComa
    emparejar("Reservada double");
    tipo_variable = 3;
    temp_variable = "double";
  } else if (tokenActual.Tipo === "Reservada bool") {
    //<Declaracion_Var> -> Bool <Lista ID> <Opcion_de_Asignacion> PuntoyComa
    emparejar("Reservada bool");
    tipo_variable = 4;
    temp_variable = "bool";
  } else {
    //<Declaracion_Var> -> epsilon <Lista ID> <Opcion_de_Asignacion> PuntoyComa
    // Para esta producción de EP en epsilon (cadena vacía), simplemente no se hace nada.
    //Esto ya es un error
    addErrorSintactico(
      "Tipo de dato",
      tokenActual.Tipo,
      tokenActual.Fila,
      tokenActual.Columna
    );
    errorSintactico = true;
  }
}

// Metodo que sirve para leer los valores a las variables
var valorVariable = "";

function Opcion_Asignacion() {
  valorVariable = "";
  if (tokenActual.Tipo === "Signo igual") {
    //<Opcion_de_Asignacion> -> Igual(=) <Expresion>
    emparejar("Signo igual");
    Expresiones();
  } else {
    if (tipo_variable == 1) {
      valorVariable = '""';
    } else if (tipo_variable == 0) {
      valorVariable = "0";
    } else if (tipo_variable == 2) {
      valorVariable = "''";
    } else if (tipo_variable == 3) {
      valorVariable = "0.0";
    } else if (tipo_variable == 4) {
      valorVariable = "false";
    } else {
      valorVariable = "0";
    }
    //<Opcion_de_Asignacion> -> Epsilon
    //Si viene epsilon quiere decir que no se le agrego un valor a la variable.
  }

  //Aqui esta la asignacion de variables tipo python -------------------------------------------------
  for (let i = 0; i < Lista_Var_Python.length; i++) {
    //Variable para verificar si el tipo alguna vez fue declarado para esa variable
    //Console.WriteLine(ListaVariables[i].GetValor + " = " + valorVariable);
    let aux_Var_P = "";
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      aux_Var_P += "  ";
    }
    aux_Var_P +=
      str_Var + Lista_Var_Python[i].Lexema + " = " + valorVariable + "\n";
    lenght_Var_For = aux_Var_P.length;
    Codigo_Python += aux_Var_P;
  }
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
  }
}

function T() {
  // T-> K TP
  K();
  TP();
}

function TP() {
  //TP-> * K TP
  //   | / K TP
  //   | Epsilon
  if (tokenActual.Tipo === "Signo por") {
    valorVariable += "*";
    emparejar("Signo por");
    K();
    TP();
  } else if (tokenActual.Tipo === "Signo dividir") {
    valorVariable += "/";
    emparejar("Signo dividir");
    K();
    TP();
  }
}

function K() {
  // K-> F KP
  F();
  KP();
}

function KP() {
  //KP-> < F KP
  //   | > F KP
  //   | == F KP
  //   | != F KP
  //   | >= F KP
  //   | <= F KP
  //   | && F KP
  //   | || F KP
  //   | Epsilon
  if (tokenActual.Tipo === "Menor que") {
    valorVariable += "<";
    emparejar("Menor que");
    F();
    KP();
  } else if (tokenActual.Tipo === "Mayor que") {
    valorVariable += ">";
    emparejar("Mayor que");
    F();
    KP();
  } else if (tokenActual.Tipo === "Igual igual") {
    valorVariable += "==";
    emparejar("Igual igual");
    F();
    KP();
  } else if (tokenActual.Tipo === "Diferente de") {
    valorVariable += "!=";
    emparejar("Diferente de");
    F();
    KP();
  } else if (tokenActual.Tipo === "Igual o mayor que") {
    valorVariable += ">=";
    emparejar("Igual o mayor que");
    F();
    KP();
  } else if (tokenActual.Tipo === "Igual o menor que") {
    valorVariable += "<=";
    emparejar("Igual o menor que");
    F();
    KP();
  } else if (tokenActual.Tipo === "And") {
    valorVariable += " and ";
    emparejar("And");
    F();
    KP();
  } else if (tokenActual.Tipo === "Or") {
    valorVariable += " or ";
    emparejar("Or");
    F();
    KP();
  }
}

function F() {
  //F-> Numero
  //  | Cadena
  //  | Caracter
  //  | Cadena HTML
  //  | NotF

  if (tokenActual.Tipo === "Numero") {
    valorVariable += tokenActual.Lexema;
    emparejar("Numero");
  } else if (tokenActual.Tipo === "Cadena") {
    valorVariable += tokenActual.Lexema;
    emparejar("Cadena");
  } else if (tokenActual.Tipo === "Caracter") {
    valorVariable += tokenActual.Lexema;
    emparejar("Caracter");
  } else if (tokenActual.Tipo === "Cadena html") {
    valorVariable += tokenActual.Lexema;
    emparejar("Cadena html");
  } else {
    NotF();
  }
}

function NotF() {
  //NotF:= !(Expresiones)
  //     | !True
  //     | !False
  //     | !ID <IDP>
  //     | (Expresiones)
  //     | True
  //     | False
  //     | ID <IDP>
  //Comparamos si puede venir un not o si no
  if (tokenActual.Tipo === "Not") {
    while (tokenActual.Tipo === "Not") {
      emparejar("Not");
      valorVariable += " not ";
    }
  }
  //Despues los tipos de variables que pueden recibir el not
  if (tokenActual.Tipo === "Parentesis izquierdo") {
    valorVariable += "(";
    emparejar("Parentesis izquierdo");
    Expresiones();
    valorVariable += ")";
    emparejar("Parentesis derecho");
  } else if (tokenActual.Tipo === "Reservada true") {
    valorVariable += tokenActual.Lexema;
    emparejar("Reservada true");
  } else if (tokenActual.Tipo === "Reservada false") {
    valorVariable += tokenActual.Lexema;
    emparejar("Reservada false");
  } else {
    valorVariable += tokenActual.Lexema;
    emparejar("Identificador");
    IDP();
  }
}

function IDP() {
  //IDP:= ()
  //    | (<Expresion> <ExpP>)
  //    | Epsilon
  //Esto es para la asignacion de funciones
  if (tokenActual.Tipo === "Parentesis izquierdo") {
    emparejar("Parentesis izquierdo");
    valorVariable += "(";
    if (tokenActual.Tipo != "Parentesis derecho") {
      expF();
      emparejar("Parentesis derecho");
      valorVariable += ")";
    } else {
      emparejar("Parentesis derecho");
      valorVariable += ")";
    }
  }
}

function expF() {
  //expF:= , <Expresion> <ExpP>
  //    | Epsilon
  Expresiones();
  if (tokenActual.Tipo === "Coma") {
    valorVariable += ", ";
    emparejar("Coma");
    expF();
  }
}

//Parametros que tenga un metodo o funcion
function Parametros() {
  //expF:= <Asignacion_de_Tipo> ID
  //    | <Asignacion_de_Tipo> ID ,
  //    | Epsilon
  Asignacion_de_Tipo();
  Codigo_Python += tokenActual.Lexema;
  emparejar("Identificador");
  if (tokenActual.Tipo === "Coma") {
    emparejar("Coma");
    Codigo_Python += ", ";
    Parametros();
  }
}

//Metodo Main
function Main() {
  Codigo_Python += "main ():\n";
  Contador_Tabs_Python++;
  emparejar("Reservada main");
  emparejar("Parentesis izquierdo");
  emparejar("Parentesis derecho");
  emparejar("Llave izquierda");
  Sentencias();
  emparejar("Llave derecha");
  Contador_Tabs_Python--;
  Codigo_Python += "\nif __name__ = “__main__”:\n";
  Codigo_Python += "  main()\n\n";
}

var isVoid = false;

function Metodo_Void() {
  isVoid = true;
  Codigo_Python += tokenActual.Lexema + " (";
  emparejar("Identificador");
  emparejar("Parentesis izquierdo");
  if (tokenActual.Tipo != "Parentesis derecho") {
    Parametros();
    emparejar("Parentesis derecho");
  } else {
    emparejar("Parentesis derecho");
  }
  Codigo_Python += "): \n";
  Contador_Tabs_Python++;
  emparejar("Llave izquierda");
  Sentencias();
  //Por si viene el return
  if (tokenActual.Tipo === "Reservada return") {
    emparejar("Reservada return");
    emparejar("Punto y coma");
  }
  emparejar("Llave derecha");
  Contador_Tabs_Python--;
  Codigo_Python += "\n";
  isVoid = false;
}

function Comentarios() {
  if (tokenActual.Tipo === "Comentario de linea") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python +=
      "# " + tokenActual.Lexema.substring(2, tokenActual.Lexema.length);
    emparejar("Comentario de linea");
    Sentencias();
  } else if (tokenActual.Tipo === "Comentario multilinea") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python +=
      "'''" +
      tokenActual.Lexema.substring(2, tokenActual.Lexema.length - 2) +
      "'''\n";
    emparejar("Comentario multilinea");
    Sentencias();
  }
}

function ComentariosGlobales() {
  if (tokenActual.Tipo === "Comentario de linea") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python +=
      "# " + tokenActual.Lexema.substring(2, tokenActual.Lexema.length);
    emparejar("Comentario de linea");
    ComentariosGlobales();
  } else if (tokenActual.Tipo === "Comentario multilinea") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python +=
      "'''" +
      tokenActual.Lexema.substring(2, tokenActual.Lexema.length - 2) +
      "'''\n";
    emparejar("Comentario multilinea");
    ComentariosGlobales();
  }
}

function ComentariosMet() {
  if (tokenActual.Tipo === "Comentario de linea") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python +=
      "# " + tokenActual.Lexema.substring(2, tokenActual.Lexema.length);
    emparejar("Comentario de linea");
    Declaracion_Cont();
  } else if (tokenActual.Tipo === "Comentario multilinea") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    Codigo_Python +=
      "'''" +
      tokenActual.Lexema.substring(2, tokenActual.Lexema.length - 2) +
      "'''\n";
    emparejar("Comentario multilinea");
    Declaracion_Cont();
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
  if (tokenActual.Tipo != "Ultimo") {
    if (errorSintactico) {
      Error_Sintactico_Permiso = false;
      if (tokenActual.Tipo != "Ultimo") {
        console.log(tokenActual);
        indice++;
        tokenActual = Lista_de_Tokens[indice];
        if (
          tokenActual.Tipo === "Punto y coma" ||
          tokenActual.Tipo === "Llave derecha"
        ) {
          errorSintactico = false;
        }
      }
    } else {
      if (tokenActual.Tipo != "Ultimo") {
        if (tokenActual.Tipo === tip) {
          indice++;
          tokenActual = Lista_de_Tokens[indice];
        } else {
          addErrorSintactico(
            tip,
            tokenActual.Tipo,
            tokenActual.Fila,
            tokenActual.Columna
          );
          errorSintactico = true;
        }
      }
    }
    /*
    if (errorSintactico) {
      if (
        tokenActual.Tipo === "Punto y coma" ||
        tokenActual.Tipo === "Llave derecha"
      ) {
        errorSintactico = false;
      }
    } else {
      if (tokenActual.Tipo != tip) {
        errorSintactico = true;
        addErrorSintactico(
          tip,
          tokenActual.Tipo,
          tokenActual.Fila,
          tokenActual.Columna
        );
      }
    }
    
    indice++;
    tokenActual = Lista_de_Tokens[indice];
    */
  }
}

//Funcion para añadir a la lista de errores
function addVar(tipo, id, fila) {
  ListaVariables.push({
    Tipo: tipo,
    Identificador: id,
    Fila: fila,
  });
}

//Proceso para la lectura de cadenas HTML
var html_print = "";
//Variables de archivos
var file_html;
var file_json;

function readHTML() {
  //Test
  var html_ =
    '<html><head><title>Example 1</title></head><body style="background: skyblue"><h2>[OLC1]Practica 2</h2><p>Si<br>sale<br>compi<br>1<br>:)<br>html sin errores..!!!</p></body></html>';
  var html_1 =
    '<html><head><title>Mi pagina</title></head><body style="background:yellow"><h1>[OLC1] Practica 1</h1><div style="background:white"><h2>Encabezado h2</h2><p>Este es un bloque<br>de texto, para una <br>prueba.</p><br></div><div style="background:skyblue"><h2>Llenar los campos</h2><label>Ingrese su nombre:</label><br><input><br><button>Mi boton</button><br></div></body></html>';
  //------------------------------------------------------------
  if (html_print != "") {
    regexHtml(html_print);
    existTag();
    parserHtml();
    if (Lista_Errores_Etiquetas.length === 0) {
      var Console_html = ace.edit("console-html");
      var Console_json = ace.edit("console-json");
      //Le asignamos lo leido
      Console_html.getSession().setValue(Codigo_Html);
      Console_json.getSession().setValue(Codigo_Json);
      //Creamos el archivo html
      file_html = new File([Codigo_Html], "Reporte.html", {
        type: "text/html;charset=utf-8",
      });
      file_json = new File([Codigo_Json], "Reporte.json", {
        type: "text/json;charset=utf-8",
      });
    } else {
      ErrorAnalisis("Existen errores en la cadena html");
    }
  }
}

//Funcion para abrir la pagina html incrustado
function openHtml() {
  openFiles(file_html);
}

//Funcion para descargar el archivo html incrustrado
function downloadHtml() {
  saveDocument(Codigo_Html, "page.html");
}

//Funcion para abrir el documento python generado
function openPython() {
  openFiles(file_python);
}

//Funcion para descargar el archivo html incrustrado
function downloadPython() {
  saveDocument(Codigo_Python, "traduccion.py");
}

//Funcion para abrir el documento python generado
function openJson() {
  openFiles(file_json);
}

//Funcion para descargar el archivo html incrustrado
function downloadJson() {
  saveDocument(Codigo_Json, "page_traducion.json");
}

//Nuevo analisis de cadena html
var Lista_Etiquetas = [];

function regexHtml(entrada) {
  //Inicializamos las listas
  Lista_Etiquetas = [];
  let lexema = "";
  let c = "";
  entrada = entrada + " ";
  let estado = 0;
  //Expresion a utilizar
  let regex = '(^</?)([-_a-zA-Z0-9:. "=]+)/?>';
  //Empezamos el analisis
  for (let i = 0; i < entrada.length; i++) {
    c = entrada[i];
    switch (estado) {
      case 0:
        if (c === "<") {
          estado = 1;
          lexema += c;
        } else {
          estado = -1;
          lexema += c;
        }
        break;
      case 1:
        if (c != ">") {
          lexema += c;
          estado = 1;
        } else {
          lexema += c;
          estado = 2;
        }
        break;
      case 2:
        if (lexema.match(regex)) {
          let aux_Lexema = lexema
            .replace("<", "")
            .replace(">", "")
            .replace("/", "_");
          if (aux_Lexema.substring(0, 5) === "body ") {
            addEtiqueta("body", lexema);
            localizeStyle(aux_Lexema.substring(5, aux_Lexema.length));
          } else if (aux_Lexema.substring(0, 4) === "div ") {
            addEtiqueta("div", lexema);
            localizeStyle(aux_Lexema.substring(4, aux_Lexema.length));
          } else if (aux_Lexema.match(/(h[1-4])/)) {
            if (aux_Lexema.substr(0, 1) === "_") {
              addEtiqueta(aux_Lexema.substr(0, 2), lexema);
            } else {
              addEtiqueta("h", lexema);
            }
          } else {
            addEtiqueta(aux_Lexema, lexema);
          }
          lexema = "";
          estado = 0;
          i--;
        } else {
          estado = 0;
          lexema = "";
          i--;
        }
        break;
      default:
        if (c != "<") {
          lexema += c;
        } else {
          addEtiqueta("text", lexema);
          lexema = "";
          estado = 0;
          i--;
        }
        break;
    }
  }
}

//Funcion style del div y body
function localizeStyle(style) {
  let lexema = "";
  style = style + " ";
  //Empezamos el analisis
  for (let i = 0; i < style.length; i++) {
    lexema += style[i];
    lexema = lexema.replace(" ", "");
    if (lexema === "style") {
      addEtiqueta(lexema, lexema);
      lexema = "";
    } else if (lexema === ":") {
      addEtiqueta(lexema, lexema);
      lexema = "";
    } else if (lexema === "=") {
      addEtiqueta(lexema, lexema);
      lexema = "";
    } else if (lexema === "background") {
      addEtiqueta(lexema, lexema);
      lexema = "";
    } else if (lexema === '"') {
      lexema = "";
    } else if (
      lexema
        .substring(0, lexema.length)
        .match(/^(yellow|green|blue|red|white|skyblue)$/)
    ) {
      addEtiqueta("color", lexema);
      i--;
      lexema = "";
    }
  }
}

//Funcion para añadir los tokens html
function addEtiqueta(tipo, lexema) {
  Lista_Etiquetas.push({
    Tipo: tipo,
    Lexema: lexema,
  });
}

//Verificar que solo esos tipos existen
function existTag() {
  Lista_Errores_Etiquetas = [];
  let regex =
    '^(_?)(html|head|title|br|p|h|button|label|input|body|div|style|:|"|background|=|color|text)$';
  Lista_Etiquetas.forEach((tag) => {
    if (!tag.Tipo.match(regex)) {
      erroresEtiquetas(tag.Lexema);
    }
  });
  console.log(Lista_Errores_Etiquetas);
}

//Erores en el html
var Lista_Errores_Etiquetas = [];

function erroresEtiquetas(tag) {
  Lista_Errores_Etiquetas.push({
    Error: "La etiqueta " + tag + " no esta en las permitidas",
  });
}

//Proceso de analisis sintactico html
var indice_html = 0;
var Codigo_Html = "";
var Codigo_Json = "";
var Cont_Tabs_Html = 0;
//Parser del analisis html
function parserHtml() {
  //Reiniamos todos los valores
  indice_html = 0;
  token_html = Lista_Etiquetas[indice_html];
  Codigo_Html = "";
  Codigo_Json = "{\n";
  Cont_Tabs_Html = 0;
  addEtiqueta("Ultimo", "Ultimo", "0", "0");
  //Empezamos analisis
  Etiquetas();
  Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
  Codigo_Json += "\n";
  Codigo_Json += "}";
}

function Etiquetas() {
  let regex = "^(html|head|p|h|button|label|body|div)$";
  let regexUnit = "^(br|input|text)$";
  if (Lista_Etiquetas[indice_html].Tipo != "Ultimo") {
    if (Lista_Etiquetas[indice_html].Tipo.match(regex)) {
      tag_start(Lista_Etiquetas[indice_html]);
      Style_Html();
      Etiquetas();
      tag_final(Lista_Etiquetas[indice_html]);
      Etiquetas();
    } else if (Lista_Etiquetas[indice_html].Tipo.match(regexUnit)) {
      tag_unit(Lista_Etiquetas[indice_html]);
      Etiquetas();
    } else if (Lista_Etiquetas[indice_html].Tipo === "title") {
      tag_start(Lista_Etiquetas[indice_html]);
      Etiquetas();
      tag_final(Lista_Etiquetas[indice_html]);
    }
  }
}

function Style_Html() {
  if (Lista_Etiquetas[indice_html].Tipo === "style") {
    indice_html = indice_html + 5;
  }
}

//Funciones para los tag y los items del html y json
//Funcion para el tag inicial html y el item cabecera
function tag_start(tag) {
  for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
    Codigo_Html += "  ";
    Codigo_Json += "  ";
  }
  indice_html++;
  Codigo_Json += '    "' + tag.Tipo + '":{\n';
  Codigo_Html += tag.Lexema + "\n";
  Cont_Tabs_Html++;
}

//Funcion para el tag final del html y cerrar el item cabecera
function tag_final(tag) {
  Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
  Codigo_Json += "\n";
  Cont_Tabs_Html--;
  for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
    Codigo_Html += "  ";
    Codigo_Json += "  ";
  }
  Codigo_Json += "    },\n";
  Codigo_Html += tag.Lexema + "\n";
  indice_html++;
}

//Funcion para el tag unitario en ciertos casos del html y los mismos items del json
function tag_unit(tag) {
  for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
    Codigo_Html += "  ";
    Codigo_Json += "  ";
  }
  Codigo_Json += '    "' + tag.Tipo + '":';
  if (tag.Tipo === "text") {
    Codigo_Json += '"' + tag.Lexema + '"' + ",\n";
  } else {
    Codigo_Json += '"",\n';
  }
  Codigo_Html += tag.Lexema + "\n";
  indice_html++;
}

//Variable que sera el file de la lista de tokens
var file_tokens;
//Funcion para obtener la lista de tokens encontrados
function printTokens() {
  //Reiniciamos el doc
  file_tokens = null;
  //Creacion del html
  var Lista_de_Tokens_HTML =
    "<html>" +
    "<head>" +
    "<meta charset='utf-8'>" +
    "<title>\n" +
    "		Reporte de Tokens\n" +
    "	</title>\n" +
    '	<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">\n' +
    '<Script Language="JavaScript">\n' +
    " function DameLaFechaHora() {\n" +
    "var hora = new Date()\n" +
    "var hrs = hora.getHours();\n" +
    "var min = hora.getMinutes();\n" +
    "var hoy = new Date();\n" +
    "var m = new Array();\n" +
    "var d = new Array()\n" +
    "var an = hoy.getFullYear();\n" +
    'm[0] = "Enero"; m[1] = "Febrero"; m[2] = "Marzo";\n' +
    'm[3] = "Abril"; m[4] = "Mayo"; \n' +
    'm[5] = "Junio";m[6] = "Julio"; m[7] = "Agosto"; m[8] = "Septiembre";\n' +
    'm[9] = "Octubre"; m[10] = "Noviembre"; m[11] = "Diciembre";\n' +
    'document.write(hrs + ":" + min + " (");\n' +
    " document.write(hoy.getDate());\n" +
    'document.write(" de ")\n;' +
    "document.write(m[hoy.getMonth()])\n;" +
    'document.write(" del " + an)\n; ' +
    'document.write(")");\n' +
    "}</Script>\n" +
    "</head><body>\n" +
    '<div class="shadow-lg p-3 mb-5 rounded bg-dark text-white">\n' +
    "		<center><h1>Reporte de Tokens \n" +
    '  <small class="text-muted bg-white">Lista de Tokens</small></h1> <script>DameLaFechaHora();</script> ' +
    "</div>\n" +
    '	<div class="container">\n' +
    '		<table class="table table-hover table-light text-center">\n' +
    ' 			 <thead class="thead-dark">   					 <tr>\n' +
    '				      <th scope="col">    #   </th>\n' +
    '				      <th scope="col">    LINEA    </th>\n' +
    '				      <th scope="col" style="width: 450px">LEXEMA</th>\n' +
    '				      <th scope="col" style="width: 400px">         TOKEN         </th>\n' +
    "				    </tr>\n" +
    "				  </thead><tbody>";
  /*
   * Enlistado del vector de tokens encontrado en el analisis
   */
  for (let i = 0; i < Lista_de_Tokens.length; i++) {
    if (
      Lista_de_Tokens[i].Tipo != "Ultimo" &&
      Lista_de_Tokens[i].Tipo != "Cadena html"
    ) {
      Lista_de_Tokens_HTML =
        Lista_de_Tokens_HTML +
        "<tr>\n" +
        '				      <th scope="row">' +
        (i + 1) +
        "</th>\n" +
        "				      <td>" +
        Lista_de_Tokens[i].Fila +
        "</td>\n" +
        '				      <td style="width: 450px" >' +
        Lista_de_Tokens[i].Lexema +
        "</td>\n" +
        '				      <td style="width: 400px">' +
        Lista_de_Tokens[i].Tipo +
        "</td>\n" +
        "				    </tr>";
    }
  }
  /*
   * Finalizacion del archivo HTML
   */
  Lista_de_Tokens_HTML =
    Lista_de_Tokens_HTML +
    "</tbody>\n" +
    "				</table>\n" +
    "\n" +
    "			</div>\n" +
    "		\n" +
    "</body>\n" +
    "</html>";

  file_tokens = new File([Lista_de_Tokens_HTML], "Lista_Tokens.html", {
    type: "text/html;charset=utf-8",
  });
  //Abre el documento
  openFiles(file_tokens);
}

//Variable que sera el file de la lista de tokens
var file_Errores;
//Funcion para obtener la lista de tokens encontrados
function printErrores() {
  //Reiniciamos el doc
  file_Errores = null;
  //Creacion del html
  var Lista_de_Errores_HTML =
    "<html>" +
    "<head>" +
    "<meta charset='utf-8'>" +
    "<title>\n" +
    "		Reporte de Errores\n" +
    "	</title>\n" +
    '	<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">\n' +
    '<Script Language="JavaScript">\n' +
    " function DameLaFechaHora() {\n" +
    "var hora = new Date()\n" +
    "var hrs = hora.getHours();\n" +
    "var min = hora.getMinutes();\n" +
    "var hoy = new Date();\n" +
    "var m = new Array();\n" +
    "var d = new Array()\n" +
    "var an = hoy.getFullYear();\n" +
    'm[0] = "Enero"; m[1] = "Febrero"; m[2] = "Marzo";\n' +
    'm[3] = "Abril"; m[4] = "Mayo"; \n' +
    'm[5] = "Junio";m[6] = "Julio"; m[7] = "Agosto"; m[8] = "Septiembre";\n' +
    'm[9] = "Octubre"; m[10] = "Noviembre"; m[11] = "Diciembre";\n' +
    'document.write(hrs + ":" + min + " (");\n' +
    " document.write(hoy.getDate());\n" +
    'document.write(" de ")\n;' +
    "document.write(m[hoy.getMonth()])\n;" +
    'document.write(" del " + an)\n; ' +
    'document.write(")");\n' +
    "}</Script>\n" +
    "</head><body>\n" +
    '<div class="shadow-lg p-3 mb-5 rounded bg-dark text-white">\n' +
    "		<center><h1>Reporte de Errores \n" +
    '  <small class="text-muted bg-white">Lista de Errores</small></h1> <script>DameLaFechaHora();</script> ' +
    "</div>\n" +
    '	<div class="container">\n' +
    '		<table class="table table-hover table-light text-center">\n' +
    ' 			 <thead class="thead-dark">   					 <tr>\n' +
    '				      <th scope="col">    #   </th>\n' +
    '				      <th scope="col">    Linea   </th>\n' +
    '				      <th scope="col">    Columna    </th>\n' +
    '				      <th scope="col" style="width: 250px">Tipo error</th>\n' +
    '				      <th scope="col" style="width: 600px">         Descripcion         </th>\n' +
    "				    </tr>\n" +
    "				  </thead><tbody>";
  /*
   * Enlistado del vector de errores lexicos encontrado en el analisis
   */
  for (let i = 0; i < Lista_de_Errores.length; i++) {
    Lista_de_Errores_HTML =
      Lista_de_Errores_HTML +
      "<tr>\n" +
      '				      <th scope="row">' +
      (i + 1) +
      "</th>\n" +
      "				      <td>" +
      Lista_de_Errores[i].Fila +
      "</td>\n" +
      "				      <td>" +
      Lista_de_Errores[i].Columna +
      "</td>\n" +
      '				      <td style="width: 250px" >' +
      "Léxico" +
      "</td>\n" +
      '				      <td style="width: 600px">' +
      "El lexema '" +
      Lista_de_Errores[i].Lexema +
      "' no pertenece al lenguaje." +
      "</td>\n" +
      "				    </tr>";
  }
  /*
   * Enlistado del vector de errores sintacticos encontrado en el analisis
   */
  for (let i = 0; i < Lista_Errores_Sintaticos.length; i++) {
    Lista_de_Errores_HTML =
      Lista_de_Errores_HTML +
      "<tr>\n" +
      '				      <th scope="row">' +
      (i + 1) +
      "</th>\n" +
      "				      <td>" +
      Lista_Errores_Sintaticos[i].Fila +
      "</td>\n" +
      "				      <td>" +
      Lista_Errores_Sintaticos[i].Columna +
      "</td>\n" +
      '				      <td style="width: 250px" >' +
      "Sintáctico" +
      "</td>\n" +
      '				      <td style="width: 600px">' +
      "Se esperaba '" +
      Lista_Errores_Sintaticos[i].Esperado +
      "', (Se encontro" +
      Lista_Errores_Sintaticos[i].Encontrado +
      ")." +
      "</td>\n" +
      "				    </tr>";
  }
  /*
   * Finalizacion del archivo HTML
   */
  Lista_de_Errores_HTML =
    Lista_de_Errores_HTML +
    "</tbody>\n" +
    "				</table>\n" +
    "\n" +
    "			</div>\n" +
    "		\n" +
    "</body>\n" +
    "</html>";

  file_Errores = new File([Lista_de_Errores_HTML], "Lista_Tokens.html", {
    type: "text/html;charset=utf-8",
  });
  //Abre el documento
  openFiles(file_Errores);
}
