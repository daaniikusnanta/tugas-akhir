/**
 * @typedef {{
*  initialState: string,
*  states: {
*    [key: string]: {
*      actions?: {
*        onEnter?: (() => void),
*        onExit?: (() => void),
*        onTick?: (() => void),
*      },
*      transitions: [
*        {
*          target: string,
*          condition: {
*             evaluate: () => boolean,
*             onFalse?: () => void
*          },
*          action?: () => void
*        }
*      ],
*    }
*  }
* }} StateMachineDefinition
*/

/**
* @typedef {{
*   value: string,
*   updateState: () => boolean,
*   tick: () => void
* }} StateMachine
*/

/**
* 
* @param {StateMachineDefinition} stateMachineDefinition 
* @returns {StateMachine}
*/
export function createMachine(stateMachineDefinition) {
   /**
    * @type {StateMachine}
    */
   const machine = {
       value: stateMachineDefinition.initialState,
       updateState: function() {
            const currentStateDefinition = stateMachineDefinition.states[this.value];
            const destinationTransitions = currentStateDefinition.transitions;

            for (const destinationTransition of destinationTransitions) {
                const destinationState = changeState(
                    currentStateDefinition,
                    destinationTransition,
                    stateMachineDefinition,
                );

                if (!destinationState) {
                    continue;
                }

                machine.value = destinationState;
                return true;
            }

            return false;
       },
       tick: function() {
           const currentStateDefinition = stateMachineDefinition.states[this.value];
           currentStateDefinition.actions?.onTick?.();
       }
   }  

   const initialStateDefinition = stateMachineDefinition.states[machine.value];
   initialStateDefinition.actions?.onEnter?.();

   return machine;
}

/**
 * Change the state of the FSM.
* @param {{
*   target: string,
*   condition?: {
*      evaluate: () => boolean,
*      onFalse?: () => void
*   },
*   action?: () => void
* }} destinationTransition 
* 
* @returns {string | null}
*/
function changeState(currentStateDefinition, destinationTransition, stateMachineDefinition) {
   const condition = destinationTransition.condition?.evaluate() ?? true;

   if (!condition) {
       destinationTransition.condition.onFalse?.();
       return null;
   }

   const destinationState = destinationTransition.target;
   const destinationStateDefinition =
       stateMachineDefinition.states[destinationState];

   destinationTransition.action?.();
   currentStateDefinition.actions?.onExit?.();
   destinationStateDefinition.actions?.onEnter?.();

   return destinationState;
}
