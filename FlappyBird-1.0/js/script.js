let stage = document.getElementById("stage");// pega o canvas do html 
let ctx = stage.getContext("2d");// contexto do canvas 

// adiciona as imagens
let bird1 = new Image();// imagem do passaro 1 
let bird2 = new Image();// imagem do passaro 2 
let bg = new Image();// imagem do background 
let footer = new Image();// imagem do chao 
let pipeNorth = new Image();// imagem do cano de cima 
let pipeSouth = new Image();// imagem do cano de baixo 

// caminho das imagens
bird1.src = "../assets/img/bird1.png";
bird2.src = "../assets/img/bird2.png";
bg.src = "../assets/img/bg.png";
footer.src = "../assets/img/footer.png";
pipeNorth.src = "../assets/img/pipeNorth.png";
pipeSouth.src = "../assets/img/pipeSouth.png";

// variaveis
let continua = true;// controla o loop do jogo 
let gap = 125;// espaço entre os canos 
let constant;// constante é o tamanho do vao do pipe (pipe + passaro) 
let birdWidth = 40;// largura do passaro 
let birdHeight = 35; // altura do passaro 
let birdX = 10;// posição horizontal do pássaro 
let birdY = 100; // posição vertical do pássaro 
let gravity = 0.45; // Gravidade mais suave e constante
let birdVelocityY = 0; // velocidade de queda
let jumpStrength = -5.4; // força do pulo
let score = 0;// pontuação do jogo 
let currentBirdImage = bird1;// Controle da animação do pássaro

//audios
let adFly = new Audio();// som do pulo do passarinho 
let adScore = new Audio();// som de pontuação 

//caminho dos audios
adFly.src = "../assets/audio/fly.mp3";
adScore.src = "../assets/audio/score.mp3";

// adiciona o evento de ao clique de qualquer tecla do teclado
document.addEventListener("keydown", function(e) {// verifica se a tecla pressionada é a barra de espaço ou seta para cima 
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault(); // Evita scroll da página
        moveUp();// chama a função de pular 
    }
});
// o botão de play again só funciona com o click do mouse
document.getElementById("btn-try-again").addEventListener("click", playAgain);

// função de pular
function moveUp() {
    if(!continua){// se o jogo não estiver rodando, não faz nada 
        return;// retorna da função 
    }
    
    // Em vez de mexer na posição diretamente, aplica força na velocidade
    birdVelocityY = jumpStrength; // Aplica força de pulo
    adFly.play();// som do evento
    // Trocar imagem a cada clique
    currentBirdImage = currentBirdImage === bird1 ? bird2 : bird1;// Alterna entre as imagens do pássaro 
}

//função gameover
function gameOver(){
    continua = false;//descontinua o jogo 
    document.getElementById("pontos").innerText = score; // atualiza a pontuação na tela
    document.getElementById("gameOver").style.display = "block";// deixa o game over visivel
}

//função playagain
function playAgain() {
    continua = true; //deixa o loop ligado
    score = 0; //começa o score com 0
    birdY = 150; //passaro começa em 150 de altura
    birdVelocityY = 0; // reseta a velocidade do passarinho
    // Resetar imagem
    currentBirdImage = bird1;
    document.getElementById("pontos").innerText = score; //atualiza a pontuação
    document.getElementById("gameOver").style.display = "none";// esconde o menu game over

    pipe = []; //cria um array vazio para guardar os canos
    pipe[0] = {// cria o primeiro pipe 
        x: stage.width, //posição horizontal inicial (fora da tela)
        y: 0 //posição vertical inicial no vertical 
    }
}

//restart nos pipes para começar dnv fora da tela
let pipe = [];

pipe[0] = {
    x: stage.width,
    y: 0
}

// função update no passaro
function updateBird() {// Atualiza a posição do pássaro com base na velocidade e gravidade 
    if (!continua) return; //enquanto continuar true retorna a função
    
    // Aplicar gravidade à velocidade
    birdVelocityY += gravity;
    
    // Limitar velocidade máxima de queda
    if (birdVelocityY > 10) {
        birdVelocityY = 10;
    }
    
    // Atualizar posição baseada na velocidade
    birdY += birdVelocityY;
    
    // Verificar colisão com o chão
    if (birdY + birdHeight >= stage.height - footer.height) { //altura do passaro e parte de baixo
        gameOver(); //puxa função game over
    }
    
    // Verificar colisão com o teto
    if (birdY <= 0) {// se o passaro bater no teto 
        birdY = 0;// reseta a posição do passaro para 0 
        birdVelocityY = 0;// reseta a velocidade do passaro para 0 
    }
}


//função para desenhar os pipes
function draw(){// desenha os pipes e o passaro na tela 
    ctx.drawImage(bg, 0, 0); //desenha o fundo na posição 0,0(centro)

    // loops para os canos
    for (let i = 0; i < pipe.length; i++){
        constant = pipeNorth.height+gap; //constante é o tamanho do vao do pipe (pipe + passaro)
        //desenha os canos de cima  e de baixo
        ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);
        
        //movimenta os canos para a esquerda (negativo)
        if(continua){
            pipe[i].x --;// pipe (i) sera jogado para a esquerda
        }

        //cria novos canos
        if(pipe[i].x == 125) { //quando chegar em 115 de distancia ele cria outro pipe
            pipe.push({
                x: stage.width, //cria um novo pipe fora da tela
                //randomiza a altura dos vãos onde o passaro passa
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            })
        }

        //confere colisão
        
        if ((birdX + birdWidth >= pipe[i].x && birdX <= pipe[i].x + pipeNorth.width //passaro alinhado com o cano horizontalmente
            && (birdY <= pipe[i].y + pipeNorth.height // passaro bateu no cano de cima
                || birdY + birdHeight >= pipe[i].y + constant))// passaro bateu no cano de baixo
            || birdY + birdHeight >= stage.height - footer.height){// passaro bateu no chão
                gameOver(); //puxa função game over
            }
            //marca pontuação
        if (pipe[i].x == 5) { // caso o pipe passe pelo x = 5 considera que o passaro passou
            score++; //aumenta a pontuação
            adScore.play(); //toca musica
        }
    }
    
    ctx.drawImage(footer, 0, stage.height-footer.height); //desenha o chao da imagem
    
    // atualiza a posição do passaro na tela
    updateBird();
    
    //resedenha o passaro para novo icone
    ctx.drawImage(currentBirdImage, birdX, birdY, birdWidth, birdHeight);

    // Pontuação
    let widthCanvas = (stage.width/2) - 10; // metade da largura da "div"(canvas) -10
    ctx.fillStyle = "#fff"; //cor do numero
    ctx.strokeStyle = "#000"; // cortorno do numero em preto
    ctx.font = "70px Flappy"; // usa font flappy
    ctx.fillText(score, widthCanvas, 80); //escreve o texto centralizando na "div"
    ctx.strokeText(score, widthCanvas, 80); //deixa o score em tema flappy

    requestAnimationFrame(draw);// chama a função draw novamente para continuar o loop do jogo 
}

window.onload = function() {// quando a janela carregar, chama a função draw 
    draw();
}