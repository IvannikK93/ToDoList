(function () {
    todoLocal = [];
    if (JSON.parse(localStorage.getItem(document.location.pathname) != null)){
        todoLocal = JSON.parse(localStorage.getItem(document.location.pathname));;
    }
    
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function inputValid() {
        let button = document.querySelector(".btn-primary")
        let inputValue = document.querySelector(".form-control");
        if (inputValue.value != "") {
            button.classList.remove('disabled');
            button.disabled = false;
        } else {
            button.classList.add('disabled');
            button.disabled = true;
        }
        return;
    }

    function createTodoItem(name, done = false) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;
        if (done) {
            item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        }
    }

    function eventButton(temp) {
        temp.doneButton.addEventListener('click', function () {
            temp.item.classList.toggle('list-group-item-success');
            modifyLocal(temp.item.firstChild.data);
        })

        temp.deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                temp.item.remove();
                deleteLocal(temp.item.firstChild.data)
            }
        })
        return;
    }

    function createTodoApp(container, title = 'Список дел', todoArr = []) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);
        inputValid();

        document.querySelector(".form-control").addEventListener('input', function () {
            inputValid();
        })

        // if (todoArr.length != 0) {
        //     for (let elem of todoArr) {
        //         let todoItem = createTodoItem(elem['name'], elem['done']);
        //         eventButton(todoItem);
        //         todoList.append(todoItem.item);
        //     }
        //     todoArr = JSON.parse(localStorage.getItem(document.location.pathname));
        //     for (let elem of todoArr) {
        //         let todoItem = createTodoItem(elem['name'], elem['done']);
        //         eventButton(todoItem);
        //         todoList.append(todoItem.item);
        //     }
        // } else {
        //     todoArr = JSON.parse(localStorage.getItem(document.location.pathname));
        //     for (let elem of todoArr) {
        //         let todoItem = createTodoItem(elem['name'], elem['done']);
        //         eventButton(todoItem);
        //         todoList.append(todoItem.item);
        //     }
        // }

        if (todoArr.length != 0) {
            preLoadTodo(todoArr, todoList);
            todoArr = JSON.parse(localStorage.getItem(document.location.pathname));
            if (todoArr != null){
                preLoadTodo(todoArr, todoList);
            }
        } else {
            todoArr = JSON.parse(localStorage.getItem(document.location.pathname));
            if (todoArr != null){
                preLoadTodo(todoArr, todoList);
            }
        }

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!todoItemForm.input.value) {
                return
            }

            let todoItem = createTodoItem(todoItemForm.input.value);
            eventButton(todoItem);
            setLocalStorage(todoItemForm.input.value);

            todoList.append(todoItem.item);
            todoItemForm.input.value = '';
            inputValid();
        })

    }

    function preLoadTodo(todoArr, todoList){
        for (let elem of todoArr) {
            let todoItem = createTodoItem(elem['name'], elem['done']);
            eventButton(todoItem);
            todoList.append(todoItem.item);
        }
    }

    function setLocalStorage(name) {
        let temp = {};
        temp.name = name;
        temp.done = false;
        todoLocal.push(temp);
        localStorage.setItem(document.location.pathname, JSON.stringify(todoLocal));
        return;
    }

    function modifyLocal(name) {
        let temp = JSON.parse(localStorage.getItem(document.location.pathname));
        for (let elem of temp) {
            if (elem['name'] === name) {
                elem['done'] = !elem['done'];
            }
        }
        localStorage.setItem(document.location.pathname, JSON.stringify(temp));
        return;
    }

    function deleteLocal(name) {
        let temp = JSON.parse(localStorage.getItem(document.location.pathname));
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].name === name) {
                temp.splice(i, 1);
            }
        }
        localStorage.setItem(document.location.pathname, JSON.stringify(temp));
        return;
    }

    window.createTodoApp = createTodoApp;
})();