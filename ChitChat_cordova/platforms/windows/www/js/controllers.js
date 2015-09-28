﻿var myprofile;
var date = new Date();
var now;
var chatMessages = [];
var newchatmessage;
var currentRoom;

angular.module('starter.controllers', [])

// GROUP
.controller('GroupCtrl', function($scope, Chats) {

	console.log( localStorage['55d177c2d20212737c46c685'] );
	
	$scope.myProfile = myprofile;
	$scope.orgGroups = main.getDataManager().orgGroups;
	$scope.pjbGroups = main.getDataManager().projectBaseGroups;
	$scope.pvGroups = main.getDataManager().privateGroups;

	//$scope.chats = Chats.all();
	$scope.chats = main.getDataManager().orgMembers;
	$scope.remove = function(chat) {
		Chats.remove(chat);
	};		
	
	$scope.viewlist = function(list) {
		var listHeight = $('#list-'+list+' .list').height();		
		if( parseInt(listHeight) != 0 ){
			$('#nav-'+list+' .button i').attr('class','icon ion-chevron-down');
			$('#list-'+list+' .list').animate({'height':'0'});
		}else{
			$('#nav-'+list+' .button i').attr('class','icon ion-chevron-up');
			$('#list-'+list+' .list').css({'height':'auto'});
		}
	};
})

// GROUP - Profile
.controller('GroupMyprofileCtrl', function($scope) {
	$scope.chat = main.getDataManager().myProfile;
})

// GROUP - Type
.controller('GroupProjectbaseCtrl', function($scope, $stateParams) {
	$scope.chat = main.getDataManager().projectBaseGroups[$stateParams.chatId];
	
	members = main.getDataManager().projectBaseGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
})
.controller('GroupPrivateCtrl', function($scope, $stateParams) {
	$scope.chat = main.getDataManager().privateGroups[$stateParams.chatId];
	
	members = main.getDataManager().privateGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
})
.controller('GroupOrggroupsCtrl', function($scope, $stateParams) {	
	$scope.chat = main.getDataManager().orgGroups[$stateParams.chatId];
	
	members = main.getDataManager().orgGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members);
	$scope.members_length = members.length;
	
			
	$scope.toggle = function (chatId) {
	    currentRoom = chatId;

	    var chatLog = localStorage.getItem(chatId);
	    console.log('local chatLog : ' + chatLog);
	    if (!!chatLog) {
	        if (JSON.stringify(chatLog) === "") {
	            chatMessages = [];
	        }
	        else {
	            var arr_fromLog = JSON.parse(chatLog);
	            if (arr_fromLog === null || arr_fromLog instanceof Array === false) {
	                chatMessages = [];
	            }
	            else {
	                arr_fromLog.forEach(msg => {
	                    var messageImp = msg;
	                    if (messageImp.type === ContentType[ContentType.Text]) {
	                        console.log(messageImp.body);
	                        main.decodeService(messageImp.body, (err, res) => {
	                            if (err)
	                                chatMessages.push(messageImp);
	                            else {
	                                messageImp.body = res;
	                                chatMessages.push(messageImp);
	                            }
	                        });
	                    }
	                    else {
	                        chatMessages.push(msg);
	                    }
 	                });
	            }
	        }
	    }
	    else
	        chatMessages = [];

	    console.log("before join", JSON.stringify(chatMessages));
		server.JoinChatRoomRequest(chatId, function(err, res){
			console.log('----------------------------------------------');
			console.log(res.code);

			if( res.code == 200 )
			{
				access = date.toISOString();
				
				allRoomAccess = myprofile.roomAccess.length;
				for(i=0; i<allRoomAccess; i++)
				{
					if( myprofile.roomAccess[i].roomId == chatId )
						access = myprofile.roomAccess[i].accessTime;
				}				
				
				//now = date.toISOString();
				//access = '2015-09-24T08:00:00.000Z';
				
				chatroom.getChatHistory(chatId, access, function(err, histories){
					members = main.getDataManager().orgMembers;
					
					var his_length = histories.length;
					if (his_length > 0)
					{
						var chatMessages_length = chatMessages.length;
						for(i=0; i< his_length; i++)
						{
						    var chatMessageImp = JSON.parse(JSON.stringify(histories[i]));
						    if (chatMessageImp.type === ContentType[ContentType.Text]) {
						        main.decodeService(chatMessageImp.body, (err, res) => {
						            console.warn(res)
						            if (err) {
						                chatMessages.push(chatMessageImp);
						            }
						            else {
						                chatMessageImp.body = res;
						                chatMessages.push(chatMessageImp);
						            }
						        });
						    }
						    else {
						        chatMessages.push(histories[i]);
						    }
						}

						localStorage.setItem(chatId, JSON.stringify(chatMessages));
					}
					
					location.href = '#/tab/message/'+chatId;
				});
			}
		});
    };
})
.controller('GroupDetailCtrl', function($scope, $stateParams) {
	$scope.chat = main.getDataManager().orgMembers[$stateParams.chatId];
})

// GROUP - Type
.controller('GroupMembersCtrl', function($scope, $stateParams) {	
	$scope.chat = main.getDataManager().orgGroups[$stateParams.chatId];
	
	members = main.getDataManager().orgGroups[$stateParams.chatId].members;
	console.log('ALL GROUP MEMBERS : '+members.length);
	$scope.members = groupMembers(members, members.length);
	$scope.members_length = members.length;
})







.controller('ChatsCtrl', function($scope, Chats) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	$scope.chats = Chats.all();
	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	
    chat = chatMessages;
	for(i=0; i<chat.length; i++)
	{
		chat[i]['sender_displayname'] = members[chat[i]['sender']]['displayname'];
		chat[i]['sender_image'] = members[chat[i]['sender']]['image'];
		
		if( chat[i]['sender'] == myprofile['_id'] )
			chat[i]['msgowner'] = 'owner';
		else
			chat[i]['msgowner'] = 'other';
	}
		
	$scope.chat = chat;
	$('#send_message').css({'display':'inline-block'});
	$('#chatroom_back').css({'display':'inline-block'});
})

.controller('FreecallCtrl', function($scope, $stateParams) {
	
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		logOut: true,
	};
}); // <-- LAST CONTROLLER



function groupMembers(members, size)
{
	var max = members.length;
	if( max > 5 )
		max = 5;
		
	if( size )
		max = size;

	gmember = [];
	//console.log('ALL GROUP MEMBERS : '+members.length);	
	for(i=0; i<max; i++)
	{
		gmember[i] = main.getDataManager().orgMembers[members[i]['id']];
		console.log('GROUP MEMBERS : '+main.getDataManager().orgMembers[members[i]['id']]['displayname']);
	}
	
	return gmember;
}

function back()
{
    server.LeaveChatRoomRequest(currentRoom, function (err, res) {
        console.log("leave room", JSON.stringify(res))
    });
    currentRoom = "";

    javascript: history.back();
	$('#send_message').css({'display':'none'});
	$('#chatroom_back').css({'display':'none'});
}

