/**
 * Checks for WebGL support for current browser
 * https://stackoverflow.com/a/22953053
 * 
 * @returns Boolean of webgl support
 */
export const webgl_support = () => { 
    try {
        let canvas = document.createElement('canvas'); 
        return !!window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch(e) {
        return false;
    }
};
