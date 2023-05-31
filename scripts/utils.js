export function setSliderValue(slider, uitext, value, text) {
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

/**
 * @type {{
*   [key: string]: ITextInstance | ISpriteFontInstance
* }}
*/
const texts = {};

/**
* 
* @param {IRuntime} runtime 
* @param {string} id 
* @returns {ITextInstance | ISpriteFontInstance}
*/
export function getTextById(runtime, id) {
   const text = texts[id];

   if (text != null) {
       return text;
   }

	const objects = [
		runtime.objects.UIText,
		runtime.objects.UIText2,
	];

	// search for the text object again in runtime
	// this is necessary because new text object might be created
	// and thus not in the cache
	for (const obj of objects) {
		const instances = obj.getAllInstances();

		for (const inst of instances) {
			if (inst.instVars['id'] === id) {
				texts[id] = inst;

				return inst;
			}
		}
	}


   throw new Error(`Text with id "${id}" not found`);
}

/**
* Cache all text objects, call this function after the layout is loaded
* @param {IRuntime} runtime 
*/
export function setupTextCache(runtime) {
   for (const prop of Object.getOwnPropertyNames(texts)) {
       delete texts[prop];
   }

   [runtime.objects.UIText].forEach(obj => {
       obj.getAllInstances().forEach(text => {
           if (text.instVars['id'] !== "") {
               texts[text.instVars['id']] = text;
           }
       });
   });

   console.log("Text cache setup complete");
   console.log(texts);
}