/**
 * State-Driven Task Manager App Engine
 * Follows unidirectional state architecture: User Actions -> Update State -> Render DOM
 */

// Global State object acting as our absolute Source of Truth
let state = {
    tasks: [],
    filter: 'all' // Options: 'all' | 'active' | 'completed'
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Selectors
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterControls = document.querySelector('.filter-controls');
    const emptyState = document.getElementById('empty-state');
    
    const progressSummary = document.getElementById('progress-summary');
    const progressFill = document.getElementById('progress-fill');

    // 1. Initialize State by reading from localStorage
    init();

    // 2. Submit Handler: Adds new task to State array
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: Date.now().toString(), // Generate reliable unique IDs
            text: taskText,
            completed: false
        };

        state.tasks.push(newTask);
        taskInput.value = ''; // Flush input field
        
        saveAndRender();
    });

    // 3. Event Delegation Selector on Parent element (No nested loops, optimized memory)
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        
        // Find closest list-item parent containing data-id metadata
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;

        if (target.classList.contains('delete-btn')) {
            // Delete Action: Filter out targeted element from global State array
            state.tasks = state.tasks.filter(task => task.id !== taskId);
        } else if (target.classList.contains('task-checkbox') || target.classList.contains('task-text')) {
            // Update Action: Toggle completed status inside State array
            state.tasks = state.tasks.map(task => {
                if (task.id === taskId) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });
        }

        saveAndRender();
    });

    // 4. Tab / Filter Selection Controller (using Event Delegation)
    filterControls.addEventListener('click', (e) => {
        const target = e.target.closest('.filter-btn');
        if (!target) return;

        // Visual / Accessibility State Toggles
        const filterBtns = filterControls.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        target.classList.add('active');
        target.setAttribute('aria-selected', 'true');

        // Update state and re-render only the matched components
        state.filter = target.dataset.filter;
        render();
    });

    /**
     * Reads persistent storage string data on initialization
     */
    function init() {
        const storedTasks = localStorage.getItem('state_tasks');
        if (storedTasks) {
            try {
                state.tasks = JSON.parse(storedTasks);
            } catch (err) {
                console.error("Local Storage configuration error. Purging corruption.", err);
                state.tasks = [];
            }
        }
        render();
    }

    /**
     * Commits state to persistent Storage and commands DOM redraw
     */
    function saveAndRender() {
        localStorage.setItem('state_tasks', JSON.stringify(state.tasks));
        render();
    }

    /**
     * Single DOM render pipeline that redraws lists based on current state
     */
    function render() {
        taskList.innerHTML = '';

        // Filter calculation based on state values
        const filteredTasks = state.tasks.filter(task => {
            if (state.filter === 'active') return !task.completed;
            if (state.filter === 'completed') return task.completed;
            return true;
        });

        // Toggle Empty State UI container
        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
            emptyState.setAttribute('aria-hidden', 'false');
        } else {
            emptyState.classList.add('hidden');
            emptyState.setAttribute('aria-hidden', 'true');
        }

        // Draw and append filtered items to the target list wrapper
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            
            li.innerHTML = `
                <div class="task-left">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        aria-label="Mark: '${escapeHTML(task.text)}' as completed"
                    >
                    <span class="task-text" role="button" tabindex="0">${escapeHTML(task.text)}</span>
                </div>
                <button class="delete-btn" aria-label="Delete task: '${escapeHTML(task.text)}'">Delete</button>
            `;
            taskList.appendChild(li);
        });

        // Synchronize metrics calculations on the dashboard
        updateMetrics();
    }

    /**
     * Recalculates metrics and updates dynamic visual progress bars
     */
    function updateMetrics() {
        const total = state.tasks.length;
        const completed = state.tasks.filter(task => task.completed).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        progressSummary.textContent = `${completed} of ${total} tasks completed`;
        progressFill.style.width = `${percent}%`;
    }

    /**
     * XSS Prevention Utility: Escapes raw input strings
     */
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});