const clearButton = document.getElementById('clear-button');
const addButton = document.getElementById('add-button');
const noteList = document.getElementById('note-list');
const textareaList = [];
const savedTextareas = JSON.parse(localStorage.getItem('savedTextareas')) || [];

clearButton.addEventListener('click', function () {
    clearLocalStorage();
    noteList.innerHTML = '';
    textareaList.length = 0;
    savedTextareas.length = 0; // Clear savedTextareas array
    saveTextareasToLocalStorage(); // Save empty array to LocalStorage
});

function clearLocalStorage() {
    localStorage.removeItem('savedTextareas');
}

function saveTextareasToLocalStorage() {
    localStorage.setItem('savedTextareas', JSON.stringify(savedTextareas));
}

savedTextareas.forEach(savedTextarea => {
    const noteItem = createNoteItem(savedTextarea);
    noteList.appendChild(noteItem);
});

addButton.addEventListener('click', function () {
    const noteItem = createNoteItem();
    noteList.appendChild(noteItem);

    const newTextarea = textareaList[textareaList.length - 1];
    const newTextareaValue = newTextarea.value;
    savedTextareas.push({
        value: newTextareaValue,
        position: {
            left: parseFloat(noteItem.style.left) || 0,
            top: parseFloat(noteItem.style.top) || 0
        }
    });
    saveTextareasToLocalStorage();

    newTextarea.addEventListener('input', function () {
        const textareaIndex = textareaList.indexOf(newTextarea);
        if (textareaIndex !== -1) {
            savedTextareas[textareaIndex].value = newTextarea.value;
            saveTextareasToLocalStorage();
        }
    });
});

function createNoteItem(savedTextarea = null) {
    const noteItem = document.createElement('div');
    noteItem.className = 'draggable';
    noteItem.style.position = 'absolute';

    const textarea = document.createElement('textarea');
    textarea.className = 'textarea-box';
    textarea.setAttribute('rows', '9');
    textarea.setAttribute('cols', '27');
    textarea.setAttribute('placeholder', 'Type your note here..');
    textarea.style.fontFamily = 'Noto Sans Thai, sans-serif';
    textarea.style.fontWeight = 'bold';

    if (savedTextarea !== null) {
        textarea.value = savedTextarea.value;
        noteItem.style.left = `${savedTextarea.position.left}px`;
        noteItem.style.top = `${savedTextarea.position.top}px`;
    }
    textareaList.push(textarea);

    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';

    noteItem.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
        noteList.removeChild(noteItem);
        const textareaIndex = textareaList.indexOf(textarea);
        if (textareaIndex !== -1) {
            textareaList.splice(textareaIndex, 1);
            const savedTextareaIndex = savedTextareas.findIndex(saved => saved.value === textarea.value);
            if (savedTextareaIndex !== -1) {
                savedTextareas.splice(savedTextareaIndex, 1);
                saveTextareasToLocalStorage();
            }
        }
    });

    noteItem.appendChild(textarea);
    noteList.appendChild(noteItem);

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    noteItem.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - noteItem.getBoundingClientRect().left;
        startY = e.clientY - noteItem.getBoundingClientRect().top;
        offsetX = e.clientX - noteItem.getBoundingClientRect().left;
        offsetY = e.clientY - noteItem.getBoundingClientRect().top;
        noteItem.style.cursor = 'grabbing';
    });

    // ... โค้ดเก่าที่คุณให้มา ...

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const left = e.clientX - startX;
            const top = e.clientY - startY;

            noteItem.style.left = `${left}px`;
            noteItem.style.top = `${top}px`;

            // Update the saved position in the textareaList
            const textareaIndex = textareaList.indexOf(textarea);
            if (textareaIndex !== -1) {
                textareaList[textareaIndex].position = { left, top };

                // Update the savedTextareas array with the modified position
                const savedTextareaIndex = savedTextareas.findIndex(saved => saved.value === textarea.value);
                if (savedTextareaIndex !== -1) {
                    savedTextareas[savedTextareaIndex].position = { left, top };
                    saveTextareasToLocalStorage();
                }
            }
        }
    });

    // ... โค้ดเก่าที่คุณให้มา ...


    document.addEventListener('mouseup', () => {
        isDragging = false;
        noteItem.style.cursor = 'grab';
    });

    return noteItem;
}