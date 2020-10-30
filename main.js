/// <reference path="jquery-3.5.1.js" />
function get_todos() {
    // todos is an array
    let todos = new Array;
    // set as string and retrieved from todo key
    let todos_str = localStorage.getItem('todo');
    //cante be null and parsed to js todos_str
    if (todos_str !== null) {
        todos = JSON.parse(todos_str);
    }
    return todos;
}

function add() {

    //get date 
    const date = new Date()
    let d = date.toUTCString();

    //get task input
    let task = document.getElementById('task').value + `,  ${d}`;
    let todos = get_todos();
    //push task into todos array
    todos.push(task);
    //stored as JSON
    localStorage.setItem('todo', JSON.stringify(todos));

    show();

    return false;

}
// clears anything not stored
function clearDefault(a) {
    if (a.defaultValue == a.value) {
        a.value == ""
    }
};

function remove() {
    //get id
    let id = this.getAttribute('id');
    //  get array using function get_todos
    let todos = get_todos();
    //delete 1st id that is chosen from todos array
    todos.splice(id, 1);
    // stores change
    localStorage.setItem('todo', JSON.stringify(todos));
    show();
    return false;
}

function show() {
    //gets array
    let todos = get_todos();
    //make snippet that creates ul and a remove button for each item in todos array
    let html = '<ul>';
    for (let i = 0; i < todos.length; i++) {
        html += '<li>' + todos[i] + '<button class="remove"  id=" ' + i + ' ">Delete</button> </li>';
    };
    html += '</ul>';
//snipps remove to todos array
    document.getElementById('todos').innerHTML = html;
// any button with class remove can be addressed by class
    let buttons = document.getElementsByClassName('remove');
// addEvent litener just like this  on click will be removed
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    };
}
//likewise on listen id Add will add
document.getElementById('add').addEventListener('click', add);
show();
