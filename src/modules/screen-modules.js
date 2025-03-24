// src/modules/screen-modules.js

// Function to initialize Unique ID Entry Screen
function initUniqueIdScreen() {
    const uniqueIdScreen = document.getElementById('unique-id-entry');
    const dataEntryScreen = document.getElementById('data-entry');
    const nextToDataButton = document.getElementById("next-to-data");
    const cowIdInput = document.getElementById('cow-id');
    const checkIdButton = document.getElementById('check-id');
    const idError = document.getElementById('id-error');
    const addCommentUniqueIdButton = document.getElementById('add-comment-unique-id');

    nextToDataButton.addEventListener('click', function() {
        uniqueIdScreen.style.display = 'none';
        dataEntryScreen.style.display = 'block';
    });

    checkIdButton.addEventListener('click', function() {
        const cowId = cowIdInput.value;
        if (cowIdExists(cowId)) {
            idError.textContent = 'Cow ID already exists!';
            idError.style.color = 'red';
        } else {
            idError.textContent = '';
        }
    });

    function cowIdExists(cowId) {
        // This is a placeholder. In a real app, you would check against your data store.
        const existingIds = ['US12345', 'US67890'];
        return existingIds.includes(cowId);
    }
    addCommentUniqueIdButton.addEventListener('click', function() {
        alert('Add comment for Unique ID');
    });
}

// Function to initialize Data Entry Screen
function initDataEntryScreen() {
    const uniqueIdScreen = document.getElementById('unique-id-entry');
    const dataEntryScreen = document.getElementById('data-entry');
    const multipleChoiceScreen = document.getElementById('multiple-choice');
    const backToUnique = document.getElementById("back-to-unique");
    const nextToMultiple = document.getElementById("next-to-multiple");
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const ageInput = document.getElementById('age');
    const motherIdInput = document.getElementById('mother-id');
    const saveDataButton = document.getElementById('save-data');
    const addCommentDataEntryButton = document.getElementById('add-comment-data-entry');

    backToUnique.addEventListener('click', function() {
        uniqueIdScreen.style.display = 'block';
        dataEntryScreen.style.display = 'none';
    });
    nextToMultiple.addEventListener('click', function() {
        dataEntryScreen.style.display = 'none';
        multipleChoiceScreen.style.display = 'block';
    });

    saveDataButton.addEventListener('click', function() {
        const weight = weightInput.value;
        const height = heightInput.value;
        const age = ageInput.value;
        const motherId = motherIdInput.value;

        const data = {
            weight: weight,
            height: height,
            age: age,
            motherId: motherId
        };

        saveData(data);
    });

    function saveData(data) {
        console.log('Saving data:', data);
        alert('Data saved! (Check console for details)');
    }
    addCommentDataEntryButton.addEventListener('click', function() {
        alert('Add comment for Data Entry');
    });
}

// Function to initialize Multiple Choice Screen
function initMultipleChoiceScreen() {
    const multipleChoiceScreen = document.getElementById('multiple-choice');
    const customizationScreen = document.getElementById('customization');
    const dataEntryScreen = document.getElementById('data-entry');
    const backToData = document.getElementById("back-to-data");
    const nextToCustomization = document.getElementById("next-to-customization");
    const calvingEaseInput = document.getElementById('calving-ease');
    const sexSelect = document.getElementById('sex');
    const breedSelect = document.getElementById('breed');
    const addCommentMultipleChoiceButton = document.getElementById('add-comment-multiple-choice');

    backToData.addEventListener('click', function() {
        dataEntryScreen.style.display = 'block';
        multipleChoiceScreen.style.display = 'none';
    });
    nextToCustomization.addEventListener('click', function() {
        customizationScreen.style.display = 'block';
        multipleChoiceScreen.style.display = 'none';
    });
    addCommentMultipleChoiceButton.addEventListener('click', function() {
        alert('Add comment for Multiple Choice');
    });
}

// Function to initialize Customization Screen
function initCustomizationScreen() {
    const customizationScreen = document.getElementById('customization');
    const multipleChoiceScreen = document.getElementById('multiple-choice');
    const breedListTextarea = document.getElementById('breed-list');
    const saveBreedsButton = document.getElementById('save-breeds');

    saveBreedsButton.addEventListener('click', function() {
        const breedList = breedListTextarea.value;
        console.log('Saving breeds:', breedList);
        alert('Breeds saved! (Check console for details)');
    });
}

export {
    initUniqueIdScreen,
    initDataEntryScreen,
    initMultipleChoiceScreen,
    initCustomizationScreen
};
