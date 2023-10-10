
class ClientStation {

    constructor(station_id,lastGeneralMessage){
        this.station_id = station_id;
        this.lastGeneralMessage = lastGeneralMessage;
        this.clients = [];
    }

    updateLastMessage(message) {
        this.lastGeneralMessage  = JSON.stringify(message);
    }

    sendMessage() {
        this.clients.forEach(client => {
            client.send( this.lastGeneralMessage);
        });
    }

    sendMessageToClient(ws) {
        try{
            if (ws.readyState === WS.OPEN) {
                ws.send( this.lastGeneralMessage);
            };
        } catch (err){
            console.log(err);
        }    
    }

    sendMessage(message) {
        const current_message = JSON.stringify(message);
        if (message.type === 'general') { 
            this.updateLastMessage(current_message); 
        }
        //console.log("Before mess: " + message.type  + "" + this.station_id + ", status: " + this.clients.length);
        //console.log(this.clients);
        this.clients.forEach(client => {
            //console.log("send mess: " + message.type + ", status: " + client.readyState);
            if (client.readyState !== 2 && client.readyState !== 3) {
                client.send(current_message);
            }
        });
    }

    addClient(ws){
        this.clients.push(ws);
        if (this.lastGeneralMessage.length > 0){
            this.sendMessageToClient(ws);
        }
    }
}

module.exports = ClientStation;