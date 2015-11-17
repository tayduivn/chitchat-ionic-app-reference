interface IUnreadMessage {
    rid: string;
    count: number;
    type: string,
    body: string; // last message id.
}

class ChatsLogComponent implements absSpartan.IRoomAccessListenerImp {
    private newMessageListeners = new Array<(param) => void>();
    public addNewMsgListener (listener) {
        this.newMessageListeners.push(listener);
    }
    onNewMessage(dataEvent) {
        console.warn("OnNewMessage", JSON.stringify(dataEvent));
        this.newMessageListeners.map((v, i, a) => {
            v(dataEvent);
        });
    }
    onAccessRoom(dataEvent) {
        console.warn("ChatsLogComponent.onAccessRoom", JSON.stringify(dataEvent));

        this._isReady = true;
        if (!!this.onReady)
            this.onReady();
    }
    onUpdatedLastAccessTime(dataEvent) {
        console.warn("onUpdatedLastAccessTime", JSON.stringify(dataEvent));
    }
    onAddRoomAccess(dataEvent) {
        console.warn("onAddRoomAccess", JSON.stringify(dataEvent));
    }
        onEditedGroupMember(dataEvent) {
            console.warn("onEditedGroupMember", JSON.stringify(dataEvent));
        }
        
        private main : Main;
        private server: ChatServer.ServerImplemented;
        public _isReady: boolean;
        public onReady:() => void;
        constructor(main: Main, server: ChatServer.ServerImplemented) {
            this.main = main;
            this.server = server;
            this._isReady = false;

            console.log("ChatsLogComponent : constructor");
        }
        
        public getUnreadMessage(roomAccess: RoomAccessData[], callback:(err: Error, logsData: Array<IUnreadMessage>) => void) {
            var self = this;
            var logs = [];
            async.mapSeries(roomAccess, function iterator(item, cb) {
                if (!!item.roomId && !!item.accessTime) {
                    self.server.getUnreadMsgOfRoom(item.roomId, item.accessTime.toString(), function res(err, res) {
                        if (err || res === null) {
                            console.warn("getUnreadMsgOfRoom: ", err);
                        }
                        else {
                            if (res.code === HttpStatusCode.success) {
                                var unread: IUnreadMessage = JSON.parse(JSON.stringify(res.data));
                                unread.rid = item.roomId;
                                logs.push(unread);
                            }
                        }
                        cb(null, null);
                    });
                }
                else {
                    cb(null, null);
                }
            }, function done(err) {
                console.log("get unread message is done.");
                callback(null, logs);
            });
        }
}