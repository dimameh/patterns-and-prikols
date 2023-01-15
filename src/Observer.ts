type Listener<EventType> = (event: EventType) => void;

type Observer<EventType> = {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
}

function createObserver<EventType>(): Observer<EventType> {
  let listeners: Listener<EventType>[] = [];

  return {
    subscribe: (listener: Listener<EventType>) => {
      listeners.push(listener);

      // convenient way to unsibscribe
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },

    publish: (event: EventType) => {
      listeners.forEach(l => l(event))
    }
  }
}

// usage example

interface SomeEvent {
  value: number
}

const observer = createObserver<SomeEvent>();

const unsubscribeFirstListener = observer.subscribe((event) => { 
  console.log(event.value) 
});

observer.subscribe((event) => { 
  console.log(event.value) 
});

observer.publish({ value: 2 }) // 2 2

unsubscribeFirstListener();

observer.publish({ value: 1 }) // 1