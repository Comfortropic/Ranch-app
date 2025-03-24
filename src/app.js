document.addEventListener('DOMContentLoaded', function() {
    // Screen Navigation
    const uniqueIdScreen = document.getElementById('unique-id-entry');
    const dataEntryScreen = document.getElementById('data-entry');
    const multipleChoiceScreen = document.getElementById('multiple-choice');
    const customizationScreen = document.getElementById('customization');

    // Buttons to other screens
    const nextToDataButton = document.getElementById("next-to-data");
    const backToUnique = document.getElementById("back-to-unique");

    //Screen Logic
    nextToDataButton.addEventListener('click', function() {
        uniqueIdScreen.style.display = 'none';
        dataEntryScreen.style.display = 'block';
    });
    backToUnique.addEventListener('click', function() {
        uniqueIdScreen.style.display = 'block';
        dataEntryScreen.style.display = 'none';
    });
    // Unique ID Entry Screen Elements
    const cowIdInput = document.getElementById('cow-id');
    const checkIdButton = document.getElementById('check-id');
    const idError = document.getElementById('id-error');
    const addCommentUniqueIdButton = document.getElementById('add-comment-unique-id');

    // Data Entry Screen Elements
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const ageInput = document.getElementById('age');
    const motherIdInput = document.getElementById('mother-id');
    const saveDataButton = document.getElementById('save-data');
    const addCommentDataEntryButton = document.getElementById('add-comment-data-entry');

    // Multiple Choice Screen Elements
    const calvingEaseInput = document.getElementById('calving-ease');
    const sexSelect = document.getElementById('sex');
    const breedSelect = document.getElementById('breed');
    const addCommentMultipleChoiceButton = document.getElementById('add-comment-multiple-choice');

    // Customization Screen Elements
    const breedListTextarea = document.getElementById('breed-list');
    const saveBreedsButton = document.getElementById('save-breeds');

    // Check if the service worker is supported
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(function(error) {
                console.error('Service Worker registration failed:', error);
            });
    }

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
        // For now, let's just check against a hardcoded list.
        const existingIds = ['US12345', 'US67890'];
        return existingIds.includes(cowId);
    }

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
        // Placeholder for saving data.  Will expand
        console.log('Saving data:', data);
        alert('Data saved! (Check console for details)');
    }
});
