
interface Session {
    name:string;   
}

class Sessions {
   
    
    constructor(private sessions:Session[]) {


    }

    containsSession(session:Session) {
        return this.sessions.indexOf(session) > -1;
    }
    

    add(session:Session) {
        if (this.containsSession(session)) {
            IDE.sessionPane.activate
        } else {
            this.sessions.push(session);
            IDE.sessionPane.addPage(session.name, true);
        }
        
    }
    
    
}