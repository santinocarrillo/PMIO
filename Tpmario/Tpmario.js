//Fondo y piso
let fondo;              
let piso;                
let fondoX = 0;           
let pisoX = -5;           
let velocidadFondo = 1;   
let velocidadPiso = 3;    

//Mario
let anchoMario = 80;              
let altoMario = 100;               
let marioneutro = [];              
let mariocorre = [];              
let mariosalta = [];              
let marioX = 350;                 
let marioY = 450;                  
let estadoMario = "neutral";       
let velocidadMarioCorre = 2;      
let nivelSueloMario = 450;   
let alturaSalto = 65;        
let velocidadSalto = 3;       
let subiendoSalto = true;     
let saltar = false;            
let distanciaSalto = 85;       
let enReboteGoomba = false;    
let tiempoInicioPausa = 0;   

//Goomba
let anchoGoomba = 60;
let altoGoomba = 100;
let goombaneutro = [];              
let goombacamina = [];              
let goombamuerto = [];              
let goombaX = 785;                 
let goombaY = 500;
let estadoGoomba = "espera";       
let tiempoInicioGoombaNeutral = 0; 
let velocidadGoombaNeutral = 1;    
let velocidadGoombaCamina = 1.2;    

function preload() {
fondo = loadImage("data/fondo.png");
piso = loadImage("data/piso.png");
for (let i = 1; i <= 2; i++) marioneutro[i - 1] = loadImage("data/ma" + i + ".png");
for (let i = 1; i <= 14; i++) mariocorre[i - 1] = loadImage("data/mb" + i + ".png");
mariosalta[0] = loadImage("data/mc1.png");
goombaneutro[0] = loadImage("data/ga1.png");
goombacamina[0] = loadImage("data/gb2.png");
goombacamina[1] = loadImage("data/gb3.png");
goombamuerto[0] = loadImage("data/gc1.png");
}

function setup() {
createCanvas(800, 600); 
}

function draw() {

//Fondo infinito
image(fondo, fondoX, 0, 800, 600);
image(fondo, fondoX + 800, 0, 800, 600);
image(piso, pisoX, 533, 805, 40);
image(piso, pisoX + 805, 533, 805, 40);
fondoX -= velocidadFondo;
pisoX -= velocidadPiso;

if (fondoX <= -800) {
fondoX = 0;
}
if (pisoX <= -800) {
pisoX = -5;
}

//Maquina de estados de Mario
//Estado Mario neutral
if (estadoMario == "neutral") {
mostrarSprite(marioneutro, marioX, marioY, anchoMario, altoMario, 15); 
marioX -= velocidadPiso; 
if (marioX <= 100) {
estadoMario = "corre";               
estadoGoomba = "neutral";            
tiempoInicioGoombaNeutral = millis(); 
}
}

// Estado Mario corre
else if (estadoMario == "corre") {
mostrarSprite(mariocorre, marioX, marioY, anchoMario, altoMario, 10); 
marioX += velocidadMarioCorre; 

// Si el goomba camina Mario salta
if (estadoGoomba == "camina" && goombaX - marioX <= distanciaSalto && !saltar) {
estadoMario = "salta";
subiendoSalto = true; 
saltar = true;      
}
}

// Estado Mario salta
else if (estadoMario == "salta") {
image(mariosalta[0], marioX, marioY, anchoMario, altoMario); 

// Mario salta y baja
if (subiendoSalto) {
marioY -= velocidadSalto; 
if (marioY <= nivelSueloMario - alturaSalto) {
subiendoSalto = false; 
}
} else {
marioY += velocidadSalto; 
if (marioY >= nivelSueloMario) {
marioY = nivelSueloMario; 
}
}

// Choca Mario con el goomba
if (!subiendoSalto                                 
&& (marioX - goombaX < 40 && goombaX - marioX < 40) 
&& (marioY + altoMario) >= goombaY               
&& estadoGoomba == "camina") {                   

  // Muere el goomba
estadoGoomba = "muerto";       
enReboteGoomba = true;         
tiempoInicioPausa = millis();  
subiendoSalto = true;          
alturaSalto = 30;              
velocidadSalto = 4;
}

// Desaparece el goomba
if (estadoGoomba == "muerto" && millis() - tiempoInicioPausa > 700) {
estadoGoomba = "desaparecido";
}
// Mario vuelve a correr
if (marioY >= nivelSueloMario && !subiendoSalto) {
marioY = nivelSueloMario; 
 
if (!enReboteGoomba || estadoGoomba == "desaparecido") {
estadoMario = "corre";
enReboteGoomba = false;
alturaSalto = 150;  
velocidadSalto = 5;
}
}
}

//Estado Goomba
if (estadoGoomba == "neutral") {
mostrarSprite(goombaneutro, goombaX, goombaY, anchoGoomba, altoGoomba, 8);
goombaX -= velocidadGoombaNeutral; 
if (millis() - tiempoInicioGoombaNeutral > 1000) {
estadoGoomba = "camina"; 
}
}
else if (estadoGoomba == "camina") {
mostrarSprite(goombacamina, goombaX, goombaY, anchoGoomba, altoGoomba, 6);
goombaX -= velocidadGoombaCamina; 
  }
else if (estadoGoomba == "muerto") {
image(goombamuerto[0], goombaX, goombaY, anchoGoomba, altoGoomba); 
}
}

function mostrarSprite(frames, x, y, ancho, alto, velocidad) {
let i = obtenerFrameActual(frames.length, velocidad);
image(frames[i], x, y, ancho, alto);
return i;
}
function obtenerFrameActual(cantidadFrames, velocidad) {
let indice = floor(frameCount / velocidad) % cantidadFrames;
return indice;
}
//Reinicio
function keyPressed() {
if (key == 'r' || key == 'R') {
reiniciarJuego();
}
}
function reiniciarJuego() {
fondoX = 0;
pisoX = -5;
marioX = 350;
marioY = 450;
estadoMario = "neutral";
alturaSalto = 150;
velocidadSalto = 5;
subiendoSalto = true;
saltar = false;
enReboteGoomba = false;
tiempoInicioPausa = 0;
tiempoInicioGoombaNeutral = 0;
goombaX = 785;
goombaY = 500;
estadoGoomba = "espera";
}
