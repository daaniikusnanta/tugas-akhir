export function setSliderValue(slider, uitext, value, text) {
	console.log(slider.instVars['id'], value);
	slider.instVars['value'] = value;
	const x = slider.instVars['minX'] + (slider.instVars['maxX'] - slider.instVars['minX']) * value / slider.instVars['maxValue'];
	slider.x = clamp(x, slider.instVars['minX'], slider.instVars['maxX']);
	uitext.text = text;
}

/**
 * 
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}