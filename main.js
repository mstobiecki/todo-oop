class Task {
	id = (Date.now() + '').slice(-10) + Math.trunc(Math.random() * 10);
	constructor(name, date) {
		this.name = name;
		this.date = date;
	}
}
class Todo {
	#newTodo;
	#todoInput;
	#addButtonInput;
	#errorInfo;
	#ulList;
	#allTodos;
	#todoToEdit;
	#todoValue;
	#removeAllButton;

	#popup;
	#popupInfo;
	#popupInput;
	#accept;
	#cancel;

	#todoList = [];

	constructor() {
		this.#todoInput = document.querySelector('.todo-input');
		this.#addButtonInput = document.querySelector('.btn-add');
		this.#errorInfo = document.querySelector('.error-info');
		this.#ulList = document.querySelector('.todolist ul');
		this.#removeAllButton = document.querySelector('.remove-todo');
		this.#popup = document.querySelector('.popup');
		this.#popupInfo = document.querySelector('.popup-info');
		this.#popupInput = document.querySelector('.popup-input');
		this.#accept = document.querySelector('.accept');
		this.#cancel = document.querySelector('.cancel');

		this.#errorInfo.textContent = 'Brak zadań na liście';

		this.#addButtonInput.addEventListener('click', this.#addTodo.bind(this));
		this.#ulList.addEventListener('click', this.#checkClick.bind(this));
		this.#cancel.addEventListener('click', this.#cancelPopup.bind(this));
		this.#accept.addEventListener('click', this.#changeTodo.bind(this));
		this.#removeAllButton.addEventListener('click', this.#removeAllTodos);
		this.#todoInput.addEventListener('keyup', (e) => {
			if (e.key === 'Enter') this.#addTodo();
		});
		this.#popupInput.addEventListener('keyup', (e) => {
			if (e.key === 'Enter') this.#changeTodo();
		});
		document.addEventListener('keyup', (e) => {
			if (e.key === 'Escape') this.#cancelPopup();
		});

		this.#getLocalStorage();
	}

	#addTodo() {
		if (this.#todoInput.value !== '') {
			this.#errorInfo.textContent = '';
			this.#newTodo = this.#todoInput.value;

			const date = new Date();
			const showDate = new Intl.DateTimeFormat(navigator.language, {
				timeStyle: 'short',
				dateStyle: 'long',
			}).format(date);

			const singleTodo = new Task(this.#newTodo, showDate);
			this.#todoList.push(singleTodo);

			this.#renderTodo(singleTodo);
			this.#setLocalStorage(singleTodo);

			this.#todoInput.value = '';
		} else this.#errorInfo.textContent = 'Uzupełnij formularz przed wysłaniem!';
	}
	#renderTodo(todo) {
		if (this.#todoList.length > 0) {
			this.#errorInfo.textContent = '';
			this.#removeAllButton.classList.remove('hidden');
		}

		const addTodoName = document.createElement('li');

		addTodoName.setAttribute('data-id', todo.id);
		addTodoName.textContent = todo.name;

		this.#ulList.append(addTodoName);

		const html = `
				<div class="time">
					<span class="date">Data dodania: ${todo.date}</span>
				</div>
				<div class="tools">
					<button class="complete"><i class="fas fa-check"></i></button>
					<button class="edit">EDIT</button>
					<button class="delete"><i class="fas fa-times"></i></button>
				</div>`;
		addTodoName.insertAdjacentHTML('beforeend', html);
	}
	#checkClick(e) {
		const clicked = (e, value) => e.target.classList.contains(value);

		if (clicked(e, 'complete')) this.#completeTodo(e);
		if (clicked(e, 'edit')) this.#editTodo(e);
		if (clicked(e, 'delete')) this.#removeTodo(e);
	}
	#completeTodo(e) {
		e.target.classList.toggle('completed');
		e.target.closest('li').classList.toggle('completed');
	}
	#editTodo(e) {
		this.#todoToEdit = e.target.closest('li');
		const todoToEditValue = this.#todoToEdit.firstChild.textContent.trimEnd();

		this.#todoValue = todoToEditValue;
		this.#popupInput.value = todoToEditValue;
		this.#changeDisplay('flex');
	}
	#changeTodo() {
		if (this.#popupInput.value !== '') {
			this.#todoToEdit.firstChild.textContent = this.#popupInput.value;
			this.#popupInfo.textContent = '';
			this.#changeDisplay('none');
		} else this.#popupInfo.textContent = 'Uzupełnij formularz przed edycją!';

		const id = this.#todoToEdit.dataset.id;
		const data = localStorage.getItem(`todo${id}`);
		const newData = data.replace(this.#todoValue, this.#popupInput.value);

		localStorage.removeItem(`todo${id}`);
		localStorage.setItem(`todo${id}`, newData);
	}
	#removeTodo(e) {
		const clicked = e.target.closest('li');
		clicked.remove();

		const index = this.#todoList.findIndex((task) => {
			return task.id === clicked.dataset.id;
		});
		this.#todoList.splice(index, 1);

		const id = clicked.dataset.id;

		localStorage.removeItem(`todo${id}`);

		this.#allTodos = this.#ulList.querySelectorAll('li');

		if (this.#allTodos.length === 0) {
			this.#errorInfo.textContent = 'Brak zadań na liście.';
			this.#removeAllButton.classList.add('hidden');
		}
	}
	#removeAllTodos() {
		localStorage.clear();
		location.reload();
	}
	#cancelPopup() {
		this.#changeDisplay('none');
	}
	#setLocalStorage(todo) {
		localStorage.setItem(`todo${todo.id}`, JSON.stringify(todo));
	}
	#getLocalStorage() {
		let storage = [];
		for (const key in localStorage) {
			if (key.startsWith('todo')) {
				storage.unshift(JSON.parse(localStorage.getItem(key)));
			}
		}

		this.#todoList = storage;

		if (this.#todoList.length === 0)
			this.#errorInfo.textContent = 'Brak zadań na liście';

		this.#todoList.forEach((task) => this.#renderTodo(task));
	}
	#changeDisplay(value) {
		this.#popup.style.display = value;
	}
}

const todo = new Todo();
