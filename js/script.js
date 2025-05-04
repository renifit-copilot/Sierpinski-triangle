/**
 * Объединенный JS файл со всей логикой приложения треугольника Серпинского
 */

// =================== ОСНОВНЫЕ ФУНКЦИИ ===================

/**
 * Рекурсивная функция для рисования треугольника Серпинского
 * @param {Number} x1 - Координата X первой точки треугольника
 * @param {Number} y1 - Координата Y первой точки треугольника
 * @param {Number} x2 - Координата X второй точки треугольника
 * @param {Number} y2 - Координата Y второй точки треугольника
 * @param {Number} x3 - Координата X третьей точки треугольника
 * @param {Number} y3 - Координата Y третьей точки треугольника
 * @param {Number} depth - Глубина рекурсии
 */
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

// =================== CANVAS ===================

/**
 * Класс для управления холстом
 */
class CanvasManager {
	/**
	 * @param {HTMLCanvasElement} canvas - DOM элемент холста
	 */
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.setupCanvas();
	}

	/**
	 * Настройка холста для поддержки высокого разрешения (Retina display)
	 */
	setupCanvas() {
		const dpr = window.devicePixelRatio || 1;
		const rect = this.canvas.getBoundingClientRect();
		
		this.canvas.width = rect.width * dpr;
		this.canvas.height = rect.height * dpr;
		
		this.ctx.scale(dpr, dpr);
		
		// Сбрасываем CSS размеры
		this.canvas.style.width = rect.width + 'px';
		this.canvas.style.height = rect.height + 'px';
	}

	/**
	 * Отрисовка треугольника Серпинского
	 * @param {Number} depth - Глубина рекурсии
	 * @param {String} color - Цвет линий треугольника
	 */
	drawSierpinskiTriangle(depth, color) {
		// Очистка холста
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		// Устанавливаем стиль линии
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 1;
		
		// Вычисляем размеры отображаемой области
		const displayWidth = this.canvas.width / window.devicePixelRatio;
		const displayHeight = this.canvas.height / window.devicePixelRatio;
		
		// Сохраняем контекст
		const ctx = this.ctx;
		
		// Рисуем треугольник
		drawSierpinski(
			0, displayHeight,         // Левый нижний угол
			displayWidth, displayHeight, // Правый нижний угол
			displayWidth / 2, 0,        // Верхняя точка
			depth
		);
	}

	/**
	 * Обработчик изменения размера окна
	 */
	handleResize() {
		this.setupCanvas();
	}
}

// =================== ОСНОВНОЙ КОД ПРИЛОЖЕНИЯ ===================

/**
 * Основной класс приложения
 */
class SierpinskiApp {
	constructor() {
		// Получаем ссылки на элементы DOM
		this.depthInput = document.getElementById('depth');
		this.colorPicker = document.getElementById('color');
		this.drawButton = document.getElementById('draw');
		
		// Инициализация холста
		this.canvasManager = new CanvasManager(document.getElementById('canvas'));
		
		// Привязка обработчиков событий
		this.initEventHandlers();
		
		// Первоначальная отрисовка
		this.draw();
	}
	
	/**
	 * Инициализация обработчиков событий
	 */
	initEventHandlers() {
		// Обработчик кнопки рисования
		this.drawButton.addEventListener('click', () => this.draw());
		
		// Обработчик изменения глубины
		this.depthInput.addEventListener('input', () => this.draw());
		
		// Обработчик изменения цвета
		this.colorPicker.addEventListener('input', () => this.draw());
		
		// Обработка изменения размера окна
		window.addEventListener('resize', () => {
			this.canvasManager.handleResize();
			this.draw();
		});
	}
	
	/**
	 * Отрисовка треугольника с текущими параметрами
	 */
	draw() {
		// Получаем значение глубины рекурсии
		const depth = parseInt(this.depthInput.value, 10);
		
		// Получаем выбранный цвет
		const color = this.colorPicker.value;
		
		// Рисуем треугольник
		this.canvasManager.drawSierpinskiTriangle(depth, color);
	}
}

// Глобальная переменная для доступа к контексту канваса из функции drawSierpinski
let ctx;

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
	// Сохраняем контекст канваса в глобальную переменную
	ctx = document.getElementById('canvas').getContext('2d');
	
	// Создаем экземпляр приложения
	new SierpinskiApp();
});