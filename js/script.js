// Получаем ссылки на элементы DOM
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const depth = document.getElementById('depth');
const colorPicker = document.getElementById('color');
const drawButton = document.getElementById('draw');

// Настройка canvas для поддержки высокого DPI
function setupCanvas() {
	// Получаем соотношение пикселей устройства
	const dpr = window.devicePixelRatio || 1;

	// Получаем текущие размеры canvas
	const rect = canvas.getBoundingClientRect();

	// Устанавливаем размеры буфера canvas в пикселях устройства
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;

	// Масштабируем контекст рисования
	ctx.scale(dpr, dpr);

	// Возвращаем CSS-размеры к исходным
	canvas.style.width = `${rect.width}px`;
	canvas.style.height = `${rect.height}px`;
}

// Рекурсивная функция для рисования треугольника Серпинского
function drawSierpinski(x1, y1, x2, y2, x3, y3, depth) {
	if (depth === 0) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.lineTo(x3, y3);
		ctx.closePath();
		ctx.stroke();
		return;
	}

	// Вычисляем середины сторон треугольника
	const mx12 = (x1 + x2) / 2, my12 = (y1 + y2) / 2;
	const mx23 = (x2 + x3) / 2, my23 = (y2 + y3) / 2;
	const mx31 = (x3 + x1) / 2, my31 = (y3 + y1) / 2;

	// Рекурсивно рисуем три меньших треугольника
	drawSierpinski(x1, y1, mx12, my12, mx31, my31, depth - 1);
	drawSierpinski(mx12, my12, x2, y2, mx23, my23, depth - 1);
	drawSierpinski(mx31, my31, mx23, my23, x3, y3, depth - 1);
}

// Функция для рисования треугольника
function draw() {
	// Настраиваем canvas для высокого DPI
	setupCanvas();

	// Получаем значение глубины рекурсии
	const d = parseInt(depth.value, 10);

	// Очищаем canvas
	ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

	// Устанавливаем стиль линии
	ctx.strokeStyle = colorPicker.value;
	ctx.lineWidth = 1;

	// Рисуем треугольник Серпинского
	// Начинаем с большого треугольника, который занимает весь canvas
	const canvasWidth = canvas.width / window.devicePixelRatio;
	const canvasHeight = canvas.height / window.devicePixelRatio;

	drawSierpinski(
		0, canvasHeight,           // Левый нижний угол
		canvasWidth, canvasHeight, // Правый нижний угол
		canvasWidth / 2, 0,          // Верхняя точка
		d
	);
}

// Привязываем функцию рисования к событиям
drawButton.onclick = draw;

// Дополнительно: живое обновление при изменении глубины
depth.oninput = draw;
colorPicker.oninput = draw;

// Инициализация при загрузке страницы
window.onload = draw;

// Перерисовка при изменении размера окна
window.onresize = draw;