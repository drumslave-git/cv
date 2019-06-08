import EventEmmiter from 'event-emitter';

const EE = EventEmmiter();

function say(msg) {
    EE.emit('say', msg)
}

export {EE, say};
