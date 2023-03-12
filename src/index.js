import css from './style.css';
import { webgl_support } from './webgl';

/**
 * Hey,
 * Should I code this in TypeScript?
 * Because I'm already tired setting up webpack
 */

console.log('index.js loaded');
if (!webgl_support()) 
    console.error('Broswer does not support WebGL');
else
    console.log('WebGL supported');


