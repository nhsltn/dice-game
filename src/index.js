// Global App
import "./css/materialize.min.css";
import "./css/styles.css";
import "./js/script";
import "./js/materialize.min";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
};