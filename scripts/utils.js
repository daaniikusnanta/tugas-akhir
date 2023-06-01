/**
 * Set the value of a slider
 * @param {ISpriteInstance} slider 
 * @param {ISpriteFontInstance} uitext 
 * @param {number} value 
 * @param {string} text 
 */
export function setSliderValue(slider, uitext, value, text) {
	slider.instVars['value'] = value;
	const x = slider.instVars['minX'] + (slider.instVars['maxX'] - slider.instVars['minX']) * value / slider.instVars['maxValue'];
	slider.x = clamp(x, slider.instVars['minX'], slider.instVars['maxX']);
	uitext.text = text;
}

/**
 * Clamp a value between a min and max
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

/**
 * @type {{
*   [key: string]: ISpriteFontInstance
* }}
*/
const texts = {};

/**
* Get a sprite font object by id
* @param {string} id 
* @returns {ISpriteFontInstance}
*/
export function getTextById(id) {
	const text = texts[id];

	if (text == null) {
		throw new Error(`Text with id "${id}" not found`);
	}

	return text;
}

/**
 * Add a sprite font object to the cache
 * @param {ISpriteFontInstance} text 
 */
export function addTextToCache(text) {
	if (text.instVars['id'] !== "") {
		texts[text.instVars['id']] = text;
	}
}

/**
 * Remove a sprite font object from the cache
 * @param {string} id 
 */
export function deleteTextFromCache(id) {
	delete texts[id];
}

/**
* Cache all text objects, call this function after the layout is loaded
* @param {IRuntime} runtime 
*/
export function setupTextCache(runtime) {
	for (const prop of Object.getOwnPropertyNames(texts)) {
		delete texts[prop];
	}

	runtime.objects.UIText.getAllInstances().forEach(addTextToCache);
}