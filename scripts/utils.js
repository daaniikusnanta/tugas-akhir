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
	// console.log("setslider", slider.instVars['id'], x, slider.instVars['minX'], slider.instVars['maxX'], value);
	slider.x = clamp(x, slider.instVars['minX'], slider.instVars['maxX']);

	if (text != null || uitext != null) {
		uitext.text = text;
	}
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

/**
 * @type {{
*   [key: string]: ISpriteInstance
* }}
*/
const clickablePanels = {};

/**
* Get a clickable panel object by id
* @param {string} id 
* @returns {ISpriteInstance}
*/
export function getClickablePanelById(id) {
	const clickablePanel = clickablePanels[id];

	if (clickablePanel == null) {
		throw new Error(`Clickable panel with id "${id}" not found`);
	}

	return clickablePanel;
}

/**
 * Add a clickable panel object to the cache
 * @param {ISpriteInstance} clickablePanel 
 */
export function addClickablePanelToCache(clickablePanel) {
	if (clickablePanel.instVars['id'] !== "") {
		clickablePanels[clickablePanel.instVars['id']] = clickablePanel;
	}
}

/**
 * Remove a clickable panel object from the cache
 * @param {string} id 
 */
export function deleteClickablePanelFromCache(id) {
	delete clickablePanels[id];
}

/**
* Cache all clickable panel objects, call this function after the layout is loaded
* @param {IRuntime} runtime 
*/
export function setupClickablePanelCache(runtime) {
	for (const prop of Object.getOwnPropertyNames(clickablePanels)) {
		delete clickablePanels[prop];
	}

	runtime.objects.ClickablePanel.getAllInstances().forEach(addClickablePanelToCache);
}

/**
 * Change z-order of a deltaSlider with mainSlider
 * @param {number} deltaValue The value of the change
 * @param {ISpriteInstance} deltaSlider Slider that shows the change of value
 * @param {ISpriteInstance} mainSlider Slider that shows the current value
 */
export function setDeltaSliderZOrder(deltaValue, deltaSlider, mainSlider) {
	if (deltaValue > 0) {
		deltaSlider.moveAdjacentToInstance(mainSlider, false);
		deltaSlider.isVisible = true;
	} else if (deltaValue < 0) {
		deltaSlider.moveAdjacentToInstance(mainSlider, true);
		deltaSlider.isVisible = true;
	} else {
		deltaSlider.isVisible = false;
	}
}

/**
 * Get an object by id
 * @param {IObjectClass} objects
 * @param {string} id
 * @returns {*}
 */ 
export function getObjectbyId(objects, id) {
	const object = objects.getAllInstances().filter(obj => obj.instVars['id'] === id)[0];

	if (object == null) {
		throw new Error(`Object with id "${id}" not found`);
	}

	return object;
}

/**
 * Set scrollable height
 * @param {IRuntime} runtime
 * @param {ISpriteInstance} scrollable
 * @param {number} itemCount
 * @param {number} itemHeight
 * @param {number} padding
 */
export function setScrollableHeight(runtime, scrollable, itemCount, itemHeight, padding) {
	const panel = getObjectbyId(runtime.objects.Panel, scrollable.instVars['id']);

    scrollable.height = itemCount * itemHeight + padding;
	scrollable.instVars['min'] = scrollable.y - scrollable.height + panel.height;
	scrollable.instVars['max'] = scrollable.y;
}

/**
 * Resets the position of a scrollable sprite instance.
 * @param {ISpriteInstance} scrollable - The scrollable sprite instance to reset.
 * @param {number} [x] - The x-coordinate to set the scrollable sprite instance to. Optional.
 * @param {number} [y] - The y-coordinate to set the scrollable sprite instance to. Optional.
 * @throws {TypeError} If the scrollable parameter is null or undefined.
 * @throws {TypeError} If the x or y parameter is not a number.
 */
export function resetScrollablePosition(scrollable, x, y) {
    if (!scrollable) {
        throw new TypeError('The scrollable parameter cannot be null or undefined.');
    }

    if (x !== undefined && typeof x !== 'number') {
        throw new TypeError('The x parameter must be a number.');
    }

    if (y !== undefined && typeof y !== 'number') {
        throw new TypeError('The y parameter must be a number.');
    }

    switch (scrollable.instVars['direction']) {
        case 'vertical':
            if (y === undefined) {
                scrollable.y = scrollable.instVars['initialY'];
            } else {
                scrollable.y = y;
            }
            break;
        case 'horizontal':
            if (x === undefined) {
                scrollable.x = scrollable.instVars['initialX'];
            } else {
                scrollable.x = x;
            }
            break;
        default:
            if (x === undefined || y === undefined) {
                scrollable.x = scrollable.instVars['initialX'];
                scrollable.y = scrollable.instVars['initialY'];
            } else {
                scrollable.x = x;
                scrollable.y = y;
            }
            break;
    }
}