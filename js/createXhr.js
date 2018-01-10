export const createXhr = () => {
    if (window.XMLHttpRequest) {
        return new window.XMLHttpRequest();
    }
    
    if (window.ActiveXObject) { // IE 6 and older
        return new window.ActiveXObject('Microsoft.XMLHTTP');
    }

    /*
    todo
    if (window.ActiveXObject) {
        try {
            return new window.ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            return new window.ActiveXObject('Microsoft.XMLHTTP');
        }
    }
    */

    throw new Error('Cannot init xhr');
};
