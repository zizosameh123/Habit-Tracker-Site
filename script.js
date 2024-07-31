document.addEventListener('DOMContentLoaded', () => {
    updateCategoryList();
    updateCategorySelect();
    updateScheduleList();

    // Event listener for category input field to add category on Enter key press
    const categoryInput = document.getElementById('categoryInput');
    categoryInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addCategory();
        }
    });

    // Event listener for habit input field to add habit on Enter key press
    const habitInput = document.getElementById('habitInput');
    habitInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addHabit();
        }
    });
});

class Habit {
    constructor(name) {
        this.name = name;
        this.count = 0;
        this.schedules = [];
    }

    increment() {
        this.count += 1;
    }

    addSchedule(time) {
        this.schedules.push(time);
    }
}

class Category {
    constructor(name) {
        this.name = name;
        this.habits = {};
    }

    addHabit(habit) {
        if (!(habit.name in this.habits)) {
            this.habits[habit.name] = habit;
            return true;
        }
        return false;
    }

    removeHabit(name) {
        if (name in this.habits) {
            delete this.habits[name];
            return true;
        }
        return false;
    }

    getHabits() {
        return this.habits;
    }
}

class HabitTracker {
    constructor() {
        this.categories = {};
    }

    addCategory(name) {
        if (name && !(name in this.categories)) {
            this.categories[name] = new Category(name);
            return true;
        }
        return false;
    }

    removeCategory(name) {
        if (name in this.categories) {
            delete this.categories[name];
            return true;
        }
        return false;
    }

    addHabit(categoryName, habitName) {
        if (categoryName in this.categories) {
            const habit = new Habit(habitName);
            return this.categories[categoryName].addHabit(habit);
        }
        return false;
    }

    removeHabit(categoryName, habitName) {
        if (categoryName in this.categories) {
            return this.categories[categoryName].removeHabit(habitName);
        }
        return false;
    }

    getCategories() {
        return this.categories;
    }
}

const habitTracker = new HabitTracker();

function addCategory() {
    const categoryInput = document.getElementById('categoryInput').value.trim();
    if (habitTracker.addCategory(categoryInput)) {
        updateCategoryList();
        updateCategorySelect();
        document.getElementById('categoryInput').value = '';
    } else {
        alert('Category already exists or invalid name.');
    }
}

function removeCategory() {
    const categorySelect = document.getElementById('categorySelect');
    const categoryToRemove = categorySelect.value;
    
    if (categoryToRemove && habitTracker.removeCategory(categoryToRemove)) {
        updateCategoryList();
        updateCategorySelect();
    } else {
        alert('Failed to remove category. Please ensure a category is selected.');
    }
}

function addHabit() {
    const habitInput = document.getElementById('habitInput').value.trim();
    const categorySelect = document.getElementById('categorySelect').value;
    if (habitTracker.addHabit(categorySelect, habitInput)) {
        updateCategoryList();
        document.getElementById('habitInput').value = '';
    } else {
        alert('Habit already exists or invalid name.');
    }
}

function removeHabit() {
    const habitInput = document.getElementById('habitInput').value.trim();
    const categorySelect = document.getElementById('categorySelect').value;
    if (habitTracker.removeHabit(categorySelect, habitInput)) {
        updateCategoryList();
        document.getElementById('habitInput').value = '';
    } else {
        alert('Habit not found or invalid name.');
    }
}

function updateCategoryList() {
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = '';
    const categories = habitTracker.getCategories();
    for (let categoryName in categories) {
        const category = categories[categoryName];
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = categoryName;
        categoryDiv.appendChild(categoryTitle);

        const habitsList = document.createElement('ul');
        const habits = category.getHabits();
        for (let habitName in habits) {
            const habit = habits[habitName];
            const li = document.createElement('li');

            const habitText = document.createElement('span');
            habitText.textContent = `${habit.name} - Count: ${habit.count}`;

            const scheduleText = document.createElement('span');
            if (habit.schedules.length > 0) {
                scheduleText.textContent = 'Time: ' + habit.schedules.join(', Time: ');
            }

            const button = document.createElement('button');
            button.textContent = 'Finished';
            button.onclick = () => {
                habit.increment();
                updateCategoryList();
            };

            li.appendChild(habitText);
            if (habit.schedules.length > 0) {
                li.appendChild(scheduleText);
            }
            li.appendChild(button);
            habitsList.appendChild(li);
        }

        categoryDiv.appendChild(habitsList);
        categoriesList.appendChild(categoryDiv);
    }
}

function updateCategorySelect() {
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.innerHTML = '';
    const categories = habitTracker.getCategories();
    for (let categoryName in categories) {
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        categorySelect.appendChild(option);
    }
}

function showScheduleMaker() {
    document.getElementById('scheduleMaker').style.display = 'block';
}

function hideScheduleMaker() {
    document.getElementById('scheduleMaker').style.display = 'none';
}

function addSchedule() {
    const habitName = document.getElementById('scheduleHabitInput').value.trim();
    const time = document.getElementById('scheduleTimeInput').value;
    const categories = habitTracker.getCategories();
    for (let categoryName in categories) {
        const category = categories[categoryName];
        if (habitName in category.getHabits()) {
            category.getHabits()[habitName].addSchedule(time);
            updateCategoryList();
            updateScheduleList();
            document.getElementById('scheduleHabitInput').value = '';
            document.getElementById('scheduleTimeInput').value = '';
            return;
        }
    }
    alert('Habit not found.');
}

function updateScheduleList() {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = '';
    const categories = habitTracker.getCategories();
    for (let categoryName in categories) {
        const category = categories[categoryName];
        const habits = category.getHabits();
        for (let habitName in habits) {
            const habit = habits[habitName];
            habit.schedules.forEach(time => {
                const li = document.createElement('li');
                li.textContent = `${habitName} - Time: ${time}`;
                scheduleList.appendChild(li);
            });
        }
    }
}

function startTracking() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('habitTracker').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    updateCategoryList();
    updateCategorySelect();
    updateScheduleList();
});

