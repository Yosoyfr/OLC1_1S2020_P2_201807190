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
  //Obtenemos la tabla
  let table = document.getElementById("table_var");
  //Limpiamos la tabla
  $(table).empty();
  //Seleccionamos el texto de la pestaña seleccionada
  let editor = ace.edit(select_Tab);
  let value_Txt = editor.getSession().getValue();
  //Empezamos con el analisis lexico
  analisis_Lexico(value_Txt);
  if (pasoLibre) {
    console.log(Lista_de_Tokens);
    console.log(Lista_de_Errores);
    //Empezamos con el analisis sintactico
    if (Lista_de_Tokens.length > 0) {
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
      } else {
        ErrorAnalisis("Existen errores sintacticos");
      }
    }
  } else {
    ErrorAnalisis("Existen errores lexicos");
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
  //Codigo traducido python
  Contador_Tabs_Python = 0;
  Codigo_Python = "";
  //Llamada al no terminal inicial
  Inicio();
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
  // si se encontro que venia una clase tiene que terminar de esta manera
  if (tokenActual.Tipo === "Llave derecha") {
    emparejar("Llave derecha");
  } else {
    console.log(
      ">> Error sintactico se esperaba [ LLave Derecha ] en lugar de [" +
        tokenActual.Tipo +
        ", " +
        tokenActual.Lexema +
        ", " +
        tokenActual.Fila +
        "]"
    );
  }
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
var for_Range = [];
var lenght_Var_For = 0;
function Ciclo_For() {
  //<For> -> for ( <Declaracion> ; <Expresion> ;  Alter) { <Sentencias> }
  for (let j = 0; j < Contador_Tabs_Python; j++) {
    Codigo_Python += "  ";
  }
  //Reiniciamos el rango
  for_Range = [];
  Codigo_Python += "for ";
  emparejar("Reservada for");
  emparejar("Parentesis izquierdo");
  Declaracion_Var();
  Codigo_Python = Codigo_Python.substring(
    0,
    Codigo_Python.length - lenght_Var_For
  );
  Codigo_Python += for_var + " in range (";
  Expresiones();
  emparejar("Punto y coma");
  Alter_Ciclos();
  emparejar("Parentesis derecho");
  emparejar("Llave izquierda");
  Codigo_Python += Number(for_Range[0]) + 1 + ", " + for_Range[1] + "):\n";
  Contador_Tabs_Python++;
  Sentencias();
  Break();
  emparejar("Llave derecha");
  Contador_Tabs_Python--;
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
  emparejar("Reservada switch");
  emparejar("Parentesis izquierdo");
  Codigo_Python += "def switch (case, " + tokenActual.Lexema + "):\n";
  Contador_Tabs_Python++;
  emparejar("Identificador");
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
  if (tokenActual.Tipo === "Reservada case") {
    for (let j = 0; j < Contador_Tabs_Python; j++) {
      Codigo_Python += "  ";
    }
    emparejar("Reservada case");
    Codigo_Python += tokenActual.Lexema + ":";
    aux_Default = tokenActual.Lexema;
    emparejar("Numero");
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
    emparejar("Reservada break");
    emparejar("Punto y coma");
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
    let aux_number = Number(aux_Default) + 1;
    Codigo_Python += aux_number + ":";
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
      html_print = tokenActual.Lexema.substring(
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
function Declaracion_Var() {
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
    if (
      cont_Var === 1 &&
      tokenActual.Tipo.match(/^(Disminucion|Incremento)$/)
    ) {
      Alter();
      emparejar("Punto y coma");
    } else {
      Opcion_Asignacion();
      emparejar("Punto y coma");
    }
  }
}

function Alter() {
  if (tokenActual.Tipo === "Disminucion") {
    emparejar("Disminucion");
  } else {
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
    console.log(
      ">> Error sintactico se esperaba [ Tipo de dato ] en lugar de [" +
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
    if (esCiclo > 0) {
      for_Range.push(tokenActual.Lexema);
    }
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
    emparejar("Not");
    valorVariable += " not ";
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

function Metodo_Void() {
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
    if (tokenActual.Tipo != "Ultimo") {
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
        Error_Sintactico_Permiso = false;
        errorSintactico = true;
      }
    }
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

//Funcion analisis html
var Lista_tokens_HTML = [];
function analisis_html(entrada) {
  //Inicializamos las listas
  Lista_tokens_HTML = [];
  let estado = 0;
  let columna = 0;
  let fila = 1;
  let lexema = "";
  let c = "";
  entrada = entrada + " ";
  //Empezamos el analisis
  for (let i = 0; i < entrada.length; i++) {
    c = entrada[i];
    columna++;
    switch (estado) {
      case 0:
        //Revisara si puede ser una etique o algun texto
        if (isLetter(c)) {
          estado = 1;
          lexema += c;
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
        else if (c === "<") {
          lexema += c;
          addToken_HTML("i_etiqueta", lexema, fila, columna);
          lexema = "";
        } else if (c === ">") {
          lexema += c;
          addToken_HTML("f_etiqueta", lexema, fila, columna);
          lexema = "";
          estado = -1;
        } else if (c === "/") {
          lexema += c;
          addToken_HTML("diagonal", lexema, fila, columna);
          lexema = "";
        } else if (c === "=") {
          lexema += c;
          addToken_HTML("igual", lexema, fila, columna);
          lexema = "";
        } else if (c === '"') {
          lexema += c;
          addToken_HTML("comillas", lexema, fila, columna);
          lexema = "";
        } else if (c === ":") {
          lexema += c;
          addToken_HTML("dos puntos", lexema, fila, columna);
          lexema = "";
        }
        //Si no es ninguno de la lista de tokens es un plain text
        else {
          estado = -1;
          i--;
          columna--;
        }
        break;
      case 1:
        //Buscara que palabra reservada es
        if (isLetterOrDigit(c)) {
          lexema += c;
          estado = 1;
        } else if (lexema === "html") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("html", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "head") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("head", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "body") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("body", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "title") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("title", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "div") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("div", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "br") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("br", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "p") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("p", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "h1") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("h", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "h2") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("h", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "h3") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("h", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "h4") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("h", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "button") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("button", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "label") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("label", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "input") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("input", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "style") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("style", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "background") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("background", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "yellow") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("color", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "green") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("color", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "blue") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("color", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "red") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("color", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "white") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("color", lexema, fila, columna);
          lexema = "";
        } else if (lexema === "skyblue") {
          i--;
          columna--;
          estado = 0;
          addToken_HTML("color", lexema, fila, columna);
          lexema = "";
        }
        //Si no es ninguno de la lista de tokens es un plain text
        else {
          i--;
          columna--;
          estado = -1;
        }
        break;
      default:
        //Es texto
        //Comprobara todos los datos que contendra el texto, hasta encontrar otro (<) para abrir una etiqueta
        if (c == "\n") {
          columna = 0;
          fila++;
          estado = -1;
          lexema += c;
        } else if (c != "<") {
          lexema += c;
          estado = -1;
        } else {
          i--;
          columna--;
          estado = 0;
          if (lexema != "") {
            addToken_HTML("text", lexema, fila, columna);
          }
          lexema = "";
        }
        break;
    }
  }
}

//Funcion para añadir los tokens html
function addToken_HTML(tipo, lexema, fila, columna) {
  Lista_tokens_HTML.push({
    Tipo: tipo,
    Lexema: lexema,
    Fila: fila,
    Columna: columna,
  });
}

//Proceso de analisis sintactico html
var indice_html = 0;
var token_html;
var Codigo_Html = "";
var Codigo_Json = "";
var Cont_Tabs_Html = 0;
//Parser del analisis html
function parserHtml() {
  //Reiniamos todos los valores
  indice_html = 0;
  token_html = Lista_tokens_HTML[indice_html];
  error_Html = false;
  Codigo_Html = "";
  Codigo_Json = "{\n";
  Cont_Tabs_Html = 0;
  //Vamos a añadir un ultimo token para saber donde termina
  addToken_HTML("Ultimo", "Ultimo", "0", "0");
  //Empezamos analisis
  Inicio_Html();
  Codigo_Json += "}";
}

function Inicio_Html() {
  emparejar_Html("i_etiqueta");
  emparejar_Html("html");
  emparejar_Html("f_etiqueta");
  Codigo_Html += "<html>\n";
  Codigo_Json += '  "html":{\n';
  Cont_Tabs_Html++;
  I_HTML();
  emparejar_Html("i_etiqueta");
  emparejar_Html("diagonal");
  emparejar_Html("html");
  emparejar_Html("f_etiqueta");
  Cont_Tabs_Html--;
  Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
  Codigo_Json += "\n";
  Codigo_Json += "    }\n";
  Codigo_Html += "</html>\n";
}

function I_HTML() {
  Head_Html();
  Body_Html();
}

function Head_Html() {
  if (Lista_tokens_HTML[indice_html].Tipo === "i_etiqueta") {
    if (Lista_tokens_HTML[indice_html + 1].Tipo === "head") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "head":{\n';
      Codigo_Html += "<head>\n";
      Cont_Tabs_Html++;
      emparejar_Html("i_etiqueta");
      emparejar_Html("head");
      emparejar_Html("f_etiqueta");
      Title_Html();
      emparejar_Html("i_etiqueta");
      emparejar_Html("diagonal");
      emparejar_Html("head");
      emparejar_Html("f_etiqueta");
      Cont_Tabs_Html--;
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += "    },\n";
      Codigo_Html += "</head>\n";
    }
  }
}

function Title_Html() {
  if (Lista_tokens_HTML[indice_html].Tipo === "i_etiqueta") {
    if (Lista_tokens_HTML[indice_html + 1].Tipo === "title") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "title":{\n';
      Codigo_Html += "<title>\n";
      Cont_Tabs_Html++;
      emparejar_Html("i_etiqueta");
      emparejar_Html("title");
      emparejar_Html("f_etiqueta");
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "texto":';
      while (token_html.Tipo === "text") {
        Codigo_Html += token_html.Lexema;
        Codigo_Json += '"' + token_html.Lexema + '"';
        emparejar_Html("text");
      }
      Codigo_Json += "\n";
      Codigo_Html += "\n";
      emparejar_Html("i_etiqueta");
      emparejar_Html("diagonal");
      emparejar_Html("title");
      emparejar_Html("f_etiqueta");
      Cont_Tabs_Html--;
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += "    }\n";
      Codigo_Html += "</title>\n";
    }
  }
}

function Body_Html() {
  if (Lista_tokens_HTML[indice_html].Tipo === "i_etiqueta") {
    if (Lista_tokens_HTML[indice_html + 1].Tipo === "body") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "body":{\n';
      Codigo_Html += "<body";
      Cont_Tabs_Html++;
      emparejar_Html("i_etiqueta");
      emparejar_Html("body");
      Style_Html();
      Codigo_Html += ">\n";
      emparejar_Html("f_etiqueta");
      Etiquetas();
      emparejar_Html("i_etiqueta");
      emparejar_Html("diagonal");
      emparejar_Html("body");
      emparejar_Html("f_etiqueta");
      Cont_Tabs_Html--;
      Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
      Codigo_Json += "\n";
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += "    },\n";
      Codigo_Html += "</body>\n";
    }
  }
}

function Style_Html() {
  if (Lista_tokens_HTML[indice_html].Tipo === "style") {
    emparejar_Html("style");
    emparejar_Html("igual");
    emparejar_Html("comillas");
    emparejar_Html("background");
    emparejar_Html("dos puntos");
    for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
      Codigo_Json += "  ";
    }
    Codigo_Json += '    "style":';
    Codigo_Json += '"background:' + token_html.Lexema + '"' + ",\n";
    Codigo_Html += ' style="background:' + token_html.Lexema + '"';
    emparejar_Html("color");
    emparejar_Html("comillas");
  }
}

function Etiquetas() {
  if (Lista_tokens_HTML[indice_html].Tipo === "i_etiqueta") {
    if (Lista_tokens_HTML[indice_html + 1].Tipo === "div") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "div":{\n';
      Codigo_Html += "<div";
      Cont_Tabs_Html++;
      emparejar_Html("i_etiqueta");
      emparejar_Html("div");
      Style_Html();
      Codigo_Html += ">\n";
      emparejar_Html("f_etiqueta");
      Etiquetas();
      emparejar_Html("i_etiqueta");
      emparejar_Html("diagonal");
      emparejar_Html("div");
      emparejar_Html("f_etiqueta");
      Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
      Codigo_Json += "\n";
      Cont_Tabs_Html--;
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += "    },\n";
      Codigo_Html += "</div>\n";
      Etiquetas();
    } else if (Lista_tokens_HTML[indice_html + 1].Tipo === "p") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "p":{\n';
      Codigo_Html += "<p>\n";
      Cont_Tabs_Html++;
      emparejar_Html("i_etiqueta");
      emparejar_Html("p");
      emparejar_Html("f_etiqueta");
      Etiquetas();
      emparejar_Html("i_etiqueta");
      emparejar_Html("diagonal");
      emparejar_Html("p");
      emparejar_Html("f_etiqueta");
      Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
      Codigo_Json += "\n";
      Cont_Tabs_Html--;
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += "    },\n";
      Codigo_Html += "</p>\n";
      Etiquetas();
    } else if (Lista_tokens_HTML[indice_html + 1].Tipo === "button") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "button":{\n';
      Codigo_Html += "<button>\n";
      Cont_Tabs_Html++;
      emparejar_Html("i_etiqueta");
      emparejar_Html("button");
      emparejar_Html("f_etiqueta");
      Etiquetas();
      emparejar_Html("i_etiqueta");
      emparejar_Html("diagonal");
      emparejar_Html("button");
      emparejar_Html("f_etiqueta");
      Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
      Codigo_Json += "\n";
      Cont_Tabs_Html--;
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += "    },\n";
      Codigo_Html += "</button>\n";
      Etiquetas();
    } else if (Lista_tokens_HTML[indice_html + 1].Tipo === "label") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "label":{\n';
      Codigo_Html += "<label>\n";
      Cont_Tabs_Html++;
      emparejar_Html("i_etiqueta");
      emparejar_Html("label");
      emparejar_Html("f_etiqueta");
      Etiquetas();
      emparejar_Html("i_etiqueta");
      emparejar_Html("diagonal");
      emparejar_Html("label");
      emparejar_Html("f_etiqueta");
      Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
      Codigo_Json += "\n";
      Cont_Tabs_Html--;
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += "    },\n";
      Codigo_Html += "</label>\n";
      Etiquetas();
    } else if (Lista_tokens_HTML[indice_html + 1].Tipo === "h") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      emparejar_Html("i_etiqueta");
      Codigo_Json += '    "' + token_html.Lexema + '":{\n';
      Codigo_Html += "<" + token_html.Lexema + ">\n";
      Cont_Tabs_Html++;
      emparejar_Html("h");
      emparejar_Html("f_etiqueta");
      Etiquetas();
      emparejar_Html("i_etiqueta");
      emparejar_Html("diagonal");
      Codigo_Json = Codigo_Json.substring(0, Codigo_Json.length - 2);
      Codigo_Json += "\n";
      Cont_Tabs_Html--;
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += "    },\n";
      Codigo_Html += "</" + token_html.Lexema + ">\n";
      emparejar_Html("h");
      emparejar_Html("f_etiqueta");
      Etiquetas();
    } else if (Lista_tokens_HTML[indice_html + 1].Tipo === "input") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "input":"",\n';
      Codigo_Html += "<input>\n";
      emparejar_Html("i_etiqueta");
      emparejar_Html("input");
      emparejar_Html("f_etiqueta");
      Etiquetas();
    } else if (Lista_tokens_HTML[indice_html + 1].Tipo === "br") {
      for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
        Codigo_Html += "  ";
        Codigo_Json += "  ";
      }
      Codigo_Json += '    "br":"",\n';
      Codigo_Html += "<br>\n";
      emparejar_Html("i_etiqueta");
      emparejar_Html("br");
      emparejar_Html("f_etiqueta");
      Etiquetas();
    }
  } else if (Lista_tokens_HTML[indice_html].Tipo === "text") {
    for (let j = 0; j < Cont_Tabs_Html * 2; j++) {
      Codigo_Html += "  ";
      Codigo_Json += "  ";
    }
    Codigo_Json += '    "texto":';
    Codigo_Json += '"' + token_html.Lexema + '"' + ",\n";
    Codigo_Html += token_html.Lexema + "\n";
    emparejar_Html("text");
    Etiquetas();
  }
}

//Emparejar html
var error_Html = false;

function emparejar_Html(tip) {
  if (!error_Html && token_html.Tipo != "Ultimo") {
    //console.log(tip);
    if (tip === token_html.Tipo) {
      indice_html++;
      token_html = Lista_tokens_HTML[indice_html];
    } else {
      console.log(token_html);
      error_Html = true;
    }
  }
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
  if (html_print != "") {
    analisis_html(html_print);
    parserHtml();
    if (!error_Html) {
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
