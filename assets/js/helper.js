/**
 * This will add event listener
 * @param {any} element 
 * @param {string} type 
 * @param {function} event 
 */
function register_event(element, type, event) {
    element.addEventListener(type, event);
}

/**
 * Set item to LocalStorage
 * @param {string} name 
 * @param {string} item 
 */
function set_item(name, item) {
    window.localStorage.setItem(name, item);
}

/**
 * Get item from LocalStorage
 * @param {string} name
 */
function get_item(name) {
    return window.localStorage.getItem(name);
}