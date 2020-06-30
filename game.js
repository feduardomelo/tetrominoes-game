document.addEventListener('DOMContentLoaded', () => {
// o DOMContentLoaded fica aqui pq o JS foi declarado no head.
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const pauseBtn = document.querySelector('#pause-button')
    const playBtn = document.querySelector('#playAgain')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]


    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]

    

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    // escolher aleatoriamente um tetromino
    let random = Math.floor(Math.random()*theTetrominos.length)
    let current = theTetrominos[random][currentRotation]
    // escolhe aleatoriamente, mas sempre na rotação 0


    //desenhando o tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    
    
    //apagando o tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }
    
    
    //setInterval(nomeDaFunção, tempo) faz com que função seja executada a uma quantidade de tempo em milissegundos
    //timerId = setInterval(moveDown, 1000)
    //o comando foi removido pq criamos a função no botão


    //atribuindo funções para keyCodes
    function control(e) {
        if(e.keyCode == 37){
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //move down function
    function moveDown(){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }


    //função para congelamento do último tetromino
    function freeze() {
        //o método some() testa se ao menos um dos elementos no array passa no teste implementado pela função atribuída e retorna true ou false
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //comece um novo tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //mover p/ esquerda. A menos que seja uma parede.
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width ===0)

        if(!isAtLeftEdge) currentPosition -=1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1
        }
        //O segundo if é para uma peça não "entrar" na outra, mas identificar como parede

        draw()
    }


    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width ===width-1)

        if(!isAtRightEdge) currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1
        }
        
        draw()
    }


    //rotação
    function rotate() {
        undraw()
        currentRotation++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        // o current precisa ser atualizado
        current = theTetrominos[random][currentRotation]
        draw()
    }
    

    //mostrar próximo tetromino no mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    //primeira rotação dos tetrominos
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
      ]

    
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    pauseBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } 
    })

    startBtn.addEventListener('click',() => {
        if (!timerId){
            draw()
            timerId = setInterval(moveDown, 1000)
            // nextRandom = Math.floor(Math.random()*theTetrominos.length)
            displayShape()
        }
    })

    function addScore(){
        for (let i =0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score+=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }


        }
    }


    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            
            clearInterval(timerId)
            document
                .querySelector(".gameover")
                .classList
                .toggle("hide")
                playBtn.addEventListener('click',() =>{
                    window.location.reload()
                })
                

            
            
        }
    }

})


