let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';
let search = '';

const taskText = document.getElementById('taskText');
const taskPriority = document.getElementById('taskPriority');
const addBtn = document.getElementById('addTaskBtn');
const msg = document.getElementById('msg');
const list = document.getElementById('list');
const noTask = document.getElementById('noTask');
const searchBox = document.getElementById('searchBox');

function save(){
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showMsg(t){
  msg.textContent = t;
  setTimeout(function(){ msg.textContent = ''; }, 2500);
}

function render(){
  list.innerHTML = '';
  let filtered = tasks.filter(function(t){
    if(filter === 'done' &&!t.done) return false;
    if(filter === 'pending' && t.done) return false;
    if(search &&!t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if(filtered.length === 0){
    noTask.style.display = 'block';
  } else {
    noTask.style.display = 'none';
  }

  filtered.forEach(function(t){
    let idx = tasks.indexOf(t);
    let li = document.createElement('li');
    li.className = 'task-item' + (t.done? ' done' : '');
    li.innerHTML = '<input type="checkbox" ' + (t.done? 'checked' : '') + ' onchange="toggleDone('+idx+')"><span class="t-title">'+t.title+'</span><span class="badge '+t.priority+'">'+t.priority+'</span><span class="task-actions"><button onclick="editTask('+idx+')">Edit</button><button onclick="deleteTask('+idx+')">Delete</button></span>';
    list.appendChild(li);
  });

  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('doneCount').textContent = tasks.filter(function(t){return t.done}).length;
  document.getElementById('pendingCount').textContent = tasks.filter(function(t){return!t.done}).length;
}

addBtn.onclick = function(){
  let title = taskText.value.trim();
  if(!title){
    showMsg('kindly add task name here');
    return;
  }
  if(title.length < 3){
    showMsg('Task name too short');
    return;
  }
  tasks.push({title: title, priority: taskPriority.value, done: false});
  taskText.value = '';
  save();
  render();
};

window.toggleDone = function(i){
  tasks[i].done =!tasks[i].done;
  save();
  render();
};

window.deleteTask = function(i){
  if(confirm('Delete this task?')){
    tasks.splice(i,1);
    save();
    render();
  }
};

window.editTask = function(i){
  let newTitle = prompt('Edit task:', tasks[i].title);
  if(newTitle && newTitle.trim().length >= 3){
    tasks[i].title = newTitle.trim();
    save();
    render();
  }
};

searchBox.oninput = function(e){
  search = e.target.value;
  render();
};

document.querySelectorAll('.f-btn').forEach(function(b){
  b.onclick = function(){
    document.querySelectorAll('.f-btn').forEach(function(x){ x.classList.remove('active'); });
    b.classList.add('active');
    filter = b.dataset.filter;
    render();
  };
});

render();
