const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
const startButton = document.getElementById("startButton")
const scoreDisplay = document.getElementById("score")

canvas.width = 400
canvas.height = 400

const box = 20 // Tamaño de la cuadrícula
let snake = [{ x: 9 * box, y: 10 * box }] // Inicializamos la serpiente
let direction = null
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
}
let score = 0
let gameInterval

// Dibuja el tablero, la serpiente y la comida
function drawGame() {
    // Fondo del tablero
    ctx.fillStyle = "#222"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibuja la comida
    ctx.fillStyle = "#ff5722"
    ctx.fillRect(food.x, food.y, box, box)

    // Dibuja la serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#76ff03" : "#8bc34a"
        ctx.fillRect(snake[i].x, snake[i].y, box, box)
    }

    // Mueve la serpiente
    const snakeX = snake[0].x
    const snakeY = snake[0].y

    let newHead
    if (direction === "LEFT") newHead = { x: snakeX - box, y: snakeY }
    else if (direction === "RIGHT") newHead = { x: snakeX + box, y: snakeY }
    else if (direction === "UP") newHead = { x: snakeX, y: snakeY - box }
    else if (direction === "DOWN") newHead = { x: snakeX, y: snakeY + box }
    else return

    // Si la serpiente come la comida
    if (newHead.x === food.x && newHead.y === food.y) {
        score++
        scoreDisplay.textContent = `Puntuación: ${score}`
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box,
        }
    } else {
        snake.pop() // Elimina la cola si no ha comido
    }

    // Agrega la nueva cabeza
    snake.unshift(newHead)

    // Si la serpiente choca con los bordes o consigo misma
    if (
        newHead.x < 0 ||
        newHead.x >= canvas.width ||
        newHead.y < 0 ||
        newHead.y >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(gameInterval)
        alert("¡Has perdido! Puntuación final: " + score)
        resetGame()
    }
}

// Detección de colisiones
function collision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true
        }
    }
    return false
}

// Controla la dirección con las teclas de flechas
document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT"
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT"
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP"
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN"
})

// Inicia el juego
startButton.addEventListener("click", () => {
    startButton.disabled = true // Deshabilita el botón al iniciar
    direction = null // Resetea la dirección
    gameInterval = setInterval(drawGame, 100) // Velocidad del juego
})

// Reinicia el juego
function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }]
    direction = null
    score = 0
    scoreDisplay.textContent = `Puntuación: 0`
    startButton.disabled = false
}
