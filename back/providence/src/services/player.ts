
export class Player {
    
    private username:  string;
    private admin: boolean; 
    private isConnected: boolean; 

    constructor(username: string, isAdmin: boolean) {
        this.username = username;
        this.admin = isAdmin;
    }

    public isAdmin = ()  => {
       return this.admin
    }

    public setIsAdmin = (isAdmin: boolean)  => {
        this.admin = isAdmin;
     }
}

