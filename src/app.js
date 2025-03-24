// src/app.js

import {
    initUniqueIdScreen,
    initDataEntryScreen,
    initMultipleChoiceScreen,
    initCustomizationScreen
} from './modules/screen-modules.js';

document.addEventListener('DOMContentLoaded', function() {

    // Screen Navigation
    const uniqueIdScreen = document.getElementById('unique-id-entry');
    const dataEntryScreen = document.getElementById('data-entry');
    const multipleChoiceScreen = document.getElementById('multiple-choice');
    const customizationScreen = document.getElementById('customization');

    // Buttons to other screens
    const nextToDataButton = document.getElementById("next-to-data");
    const backToUnique = document.getElementById("back-to-unique");
    const nextToMultiple = document.getElementById("next-to-multiple");
    const backToData = document.getElementById("back-to-data");
    const nextToCustomization = document.getElementById("next-to-customization");

    // Screen Logic
    initUniqueIdScreen();
    initDataEntryScreen();
    initMultipleChoiceScreen();
    initCustomizationScreen();

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
});
