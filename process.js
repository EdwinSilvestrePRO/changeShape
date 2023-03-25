class MoveElement extends Object {
	static actived = !true;
	constructor ($element, collectionClass) {
		super();
		this.$element = $element;
		this.domRect = ()=> this.$element.getBoundingClientRect();
		this.collectionClass = collectionClass;
		this.leftRelative = 0;
		this.topRelative = 0;
		this.actual = 0;
		this.data = null
	}
	move (x, y) {
		this.$element.style.left = `${x}px`;
		this.$element.style.top = `${y}px`;
	}
	transform(typeForm, element) {
		for (let theClass of this.collectionClass) 
			this[element].classList.remove(theClass);

		this[element].classList.add(typeForm);
	}
	position () {
		this.actual++;

		if(this.actual >= this.collectionClass.length) this.actual = 0;
		else {}

		return this.actual;
	}

}

const me = new MoveElement(document.getElementById("figure"), [
	"circle",
	"pentagon",
	"triangle",
	"exagon"
	]);

// for Windows...
function forWindows (EV) {
	if(EV.type == "mousedown" && EV.target.matches("#figure")) {
		// Proibe la selección.
		EV.preventDefault();
		// indicar que está activo el desplazamiento.
		MoveElement.actived = true;
		// Desactivar transición
		(me.$element.removeAttribute("data-transition"));
		// el resto
		let {x, width, right, y} = me.domRect();
		me.move(x, y);

		me.leftRelative = (EV.clientX - x);
		me.topRelative = (EV.clientY - y);
	}
	else if(EV.type === "mousemove" && MoveElement.actived) {
		let {x, y, right, width, height} = me.domRect();

		if(EV.clientX - me.leftRelative <= 0 
			|| EV.clientY - me.topRelative <= 0) return;
			else {}

		if (EV.clientX - me.leftRelative + width >= window.innerWidth
			|| EV.clientY - me.topRelative + height >= window.innerHeight) return;
		else {}

		me.move(EV.clientX - me.leftRelative, EV.clientY - me.topRelative);
		// Definición de las coordenadas.
		document.body
				.setAttribute("style", `--top-actual: ${y}px; --left-actual: ${x}px`);
	}

	else if(EV.type == "mouseup" && MoveElement.actived) {
		MoveElement.actived = false;
		const $figureActual = document.getElementById("figureActual");
		rect = $figureActual.getBoundingClientRect();
		
		if (EV.clientX < rect.right && EV.clientX > rect.left) {

			if(EV.clientY > rect.top && EV.clientY < rect.bottom) {
				me.$element.setAttribute("style", "");
				let nameClass = me.$element.className;
				$figureActual.className = (nameClass);
				me.$element.className = me.collectionClass[me.position()];

				me.$element
				.setAttribute("data-transition", "yes");

				setTimeout(()=> me.$element
				.setAttribute("data-transition", ""), 50);
			}
		}
	}
}


function forAndroid (Ev) {
	if(Ev.type == "touchstart" && Ev.target.matches("#figure")) {
		// Desactivar transición
		(me.$element.removeAttribute("data-transition"));
		MoveElement.actived = true;
		// el resto
		let {x, width, right, y} = me.domRect(),
		{clientX, clientY} = Ev.touches[0];
		me.move(x, y);
		
		me.leftRelative = (clientX - x);
		me.topRelative = (clientY - y);
	}

	else if(Ev.type == "touchmove" && MoveElement.actived) {
		const touch1 = Ev.changedTouches[0],
		{clientX, clientY} = touch1;
		
		let {x, y, right, width, height} = me.domRect();

		document.body
		.setAttribute("style", `--top-actual: ${y}px; --left-actual: ${x}px`);

		if(clientX - me.leftRelative <= 0 
			|| clientY - me.topRelative <= 0) return;
			else {}

		if (clientX - me.leftRelative + width >= window.innerWidth
			|| clientY - me.topRelative + height >= window.innerHeight) return;
		else {}

		me.move(clientX - me.leftRelative, clientY - me.topRelative);
		me.data = {
			clientY,
			clientX
		};
	} 
	else if (Ev.type == "touchend" && MoveElement.actived) {
		MoveElement.actived = false;
		const {clientX, clientY} = (me.data);
		const $figureActual = document.getElementById("figureActual");
		rect = $figureActual.getBoundingClientRect();
		
		if (clientX < rect.right && clientX > rect.left) {

			if(clientY > rect.top && clientY < rect.bottom) {
				me.$element.setAttribute("style", "");
				let nameClass = me.$element.className;
				$figureActual.className = (nameClass);
				me.$element.className = me.collectionClass[me.position()];

				me.$element
				.setAttribute("data-transition", "yes");

				setTimeout(()=> me.$element
				.setAttribute("data-transition", ""), 50);
			}
		}
	}
}


const platform = navigator.userAgentData !== undefined? navigator.userAgentData.platform : navigator.userAgent,
isWindows = 
	/window(s)?/i
	.test(platform),

	nameEvents = {
	start: isWindows? "mousedown" : "touchstart",
	move: isWindows? "mousemove" : "touchmove",
	end: isWindows? "mouseup" : "touchend",
};

// the start.
document
.addEventListener(nameEvents.start, EV=> {
	if(isWindows) forWindows(EV);
	else forAndroid(EV);
});

// the move.
document
.addEventListener(nameEvents.move, EV=> {
	if(isWindows) forWindows(EV);
	else forAndroid(EV);
});

// the end.
document
.addEventListener(nameEvents.end, EV=> {
	if(isWindows) forWindows(EV);
	else forAndroid(EV);
});