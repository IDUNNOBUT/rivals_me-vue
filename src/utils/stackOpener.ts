import { h, type Component } from 'vue';

interface StackItem<T> {
  component: Component;
  props: Omit<T, 'close'> & { close: () => void };
  id: string;
  width?: 'm' | 'l';
}

// Array to store stack items
let stack: StackItem<any>[] = [];

// Custom event for stack updates
export const stackUpdateEvent = 'stack-update';

const updateStack = () => {
  // Dispatch event to notify StackManager of changes
  const event = new CustomEvent(stackUpdateEvent, { detail: [...stack] });
  document.dispatchEvent(event);
};

export const stackOpener = {
  open: <T extends { close: () => void }>(
    component: Component,
    props: Omit<T, 'close'> & { width?: 'm' | 'l' }
  ) => {
    const { width, ...componentProps } = props;
    const id = Math.random().toString(36).substr(2, 9);
    
    // Create a close function that removes the stack item
    const close = () => {
      stack = stack.filter(item => item.id !== id);
      updateStack();
    };
    
    // Push the new stack item
    stack.push({ 
      component, 
      props: {
        ...componentProps,
        close
      }, 
      id, 
      width 
    });
    
    updateStack();
    
    return { id, close };
  }
}; 