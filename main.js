class App {
	#newTodo;
	#todoInput;
	#addButtonInput;
	#errorInfo;
	#ulList;
	#allTodos;
	#todoToEdit;

	#popup;
	#popupInfo;
	#popupInput;
	#accept;
	#cancel;

	#todoList = [];

	id = (Date.now() + '').slice(-10);

	constructor() {
		this.#todoInput = document.querySelector('.todo-input');
		this.#addButtonInput = document.querySelector('.btn-add');
		this.#errorInfo = document.querySelector('.error-info');
		this.#ulList = document.querySelector('.todolist ul');

		this.#popup = document.querySelector('.popup');
		this.#popupInfo = document.querySelector('.popup-info');
		this.#popupInput = document.querySelector('.popup-input');
		this.#accept = document.querySelector('.accept');
		this.#cancel = document.querySelector('.cancel');

		this.#errorInfo.textContent = 'Brak zadań na liście';

		this.#addButtonInput.addEventListener('click', this._addTodo.bind(this));
		this.#ulList.addEventListener('click', this._checkClick.bind(this));
		this.#cancel.addEventListener('click', this._cancelPopup.bind(this));
		this.#accept.addEventListener('click', this._changeTodo.bind(this));
		this.#todoInput.addEventListener('keyup', (e) => {
			if (e.key === 'Enter') this._addTodo();
		});
	}

	_addTodo() {
		if (this.#todoInput.value !== '') {
			this.#errorInfo.textContent = '';
			this.#newTodo = this.#todoInput.value;

			const date = new Date();
			const showDate = new Intl.DateTimeFormat(navigator.language, {
				timeStyle: 'short',
				dateStyle: 'long',
			}).format(date);

			const html = `
				<li data-id='${this.id}'>${this.#newTodo}
					<div class="time">
						<span class="date">Data dodania: ${showDate}</span>
					</div>
					<div class="tools">
						<button class="complete"><i class="fas fa-check"></i></button>
						<button class="edit">EDIT</button>
						<button class="delete"><i class="fas fa-times"></i></button>
					</div>
				</li>`;
			this.#ulList.insertAdjacentHTML('beforeend', html);

			const allTodo = [this.id, this.#newTodo, showDate];

			this.#todoList.push(allTodo);
			console.log(this.#todoList);
			this.#todoInput.value = '';
		} else this.#errorInfo.textContent = 'Uzupełnij formularz przed wysłaniem!';
	}
	_checkClick(e) {
		const clicked = (e, value) => e.target.classList.contains(value);

		if (clicked(e, 'complete')) this._completeTodo(e);
		if (clicked(e, 'edit')) this._editTodo(e);
		if (clicked(e, 'delete')) this._removeTodo(e);
	}
	_completeTodo(e) {
		e.target.classList.toggle('completed');
		e.target.closest('li').classList.toggle('completed');
	}
	_editTodo(e) {
		this.#todoToEdit = e.target.closest('li');
		console.log(this.#todoToEdit);
		this.#popupInput.value = this.#todoToEdit.firstChild.textContent.trimEnd();
		this._changeDisplay('flex');
	}
	_changeTodo() {
		if (this.#popupInput.value !== '') {
			this.#todoToEdit.firstChild.textContent = this.#popupInput.value;
			this.#popupInfo.textContent = '';
			this._changeDisplay('none');
		} else {
			this.#popupInfo.textContent = 'Uzupełnij formularz przed edycją!';
		}
	}
	_removeTodo(e) {
		e.target.closest('li').remove();
		this.#allTodos = this.#ulList.querySelectorAll('li');

		if (this.#allTodos.length === 0)
			this.#errorInfo.textContent = 'Brak zadań na liście.';
	}
	_cancelPopup() {
		this._changeDisplay('none');
	}
	_changeDisplay(value) {
		this.#popup.style.display = value;
	}
}

const app = new App();
