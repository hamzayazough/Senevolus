from flask_socketio import emit, join_room
from flask import Flask, request
from models.user_model import get_user_by_id, add_user
from models.task_model import get_tasks_by_elder, get_tasks_by_volunteer
messages = [
    {
        'name' : 'Mina',
        'message':'Hey',
        'type' : 'received'
    }, 
    {
        'name' : 'Samuel',
        'message':'Hey1',
        'type' : 'received'
    }, 
    {
        'name' : 'Mina',
        'message':'Hey2',
        'type' : 'received'
    }, 
    {
        'name' : 'Mina',
        'message':'Hey3',
        'type' : 'sent'
    }, 
    {
        'name' : 'Samuel',
        'message':'Hey4',
        'type' : 'received'
    }, 
    {
        'name' : 'Mina',
        'message':'Hey',
        'type' : 'received'
    }, 
    {
        'name' : 'Mina',
        'message':'Hey',
        'type' : 'received'
    }, 
    {
        'name' : 'Mina',
        'message':'Hey',
        'type' : 'received'
    }, 
    {
        'name' : 'Mina',
        'message':'Hey',
        'type' : 'received'
    }, 
    {
        'name' : 'Mina',
        'message':'Hey',
        'type' : 'received'
    }, 
    {
        'name' : 'Samuel',
        'message':'Hey',
        'type' : 'received'
    }, 
    {
        'name' : 'Mina',
        'message':'Hey',
        'type' : 'received'
    }, 
]


def socketio_handlers(socketio):
    @socketio.on('send_message')
    def send_message(data):
        #room = data['task_id']
        #emit('new_message', data, to=room)
        print(data)

    @socketio.on('connect_getuser')
    def connect_getuser(data):
        print("getting connect get user")
        userdata = get_user_by_id(data)
        print(userdata)
        emit('connect_getuser', userdata, to=request.sid)

    @socketio.on('getuser')
    def connect_getuser(data):
        print("getting get user")
        userdata = get_user_by_id(data)
        emit('gotuser', userdata, to=request.sid)

    @socketio.on('createUser')
    def userCreated(data):
        new_user = {'_id':data['_id'], 'firstName':data['firstName'],
        'lastName':data['lastName'],
        'username':data['username'],
        'email':data['email'],
        'role':data['role'],
        'id_card':data['id_card'],
        'photo_id':data['photo_id'],
        'age':data['age'],
        'address':data['address'],
        'description':data['description'],
        'points':0}
        print(new_user)
        print(add_user(new_user))
        userdata = get_user_by_id(data['_id'])
        print('got user data')
        print(userdata)
        emit('userCreated', userdata['data'], to=request.sid)

    @socketio.on('join_room')
    def join_task_chat(data):
        room = data['task_id']
        join_room(room)
        emit('chat_notification', {"message": f"{data['username']} joined the room"}, to=room)

    @socketio.on('task_status_change')
    def task_status_change(data):
        room = data['elder_id']
        emit('task_update', data, to=room)

    @socketio.on('connect')
    def handle_connect():
        print("Client connected")

    @socketio.on('getListElder')
    def getListElder(data):
        taskList = get_tasks_by_elder(data)
        emit('gotListElder', {'task': taskList})
    
    @socketio.on('getListVolunteer')
    def getListVolunteer(data):
        print(data)
        taskList = get_tasks_by_volunteer(data)
        emit('gotListVolunteer', {'task': taskList}, to=request.sid)
    
    @socketio.on('getMessages')
    def getMessages():
        emit('gotMessages', messages, to=request.sid)

    @socketio.on('sendMessage')
    def sendMessage(data):
        emit('receivedMessage', data, include_self=False)

    @socketio.on('disconnect')
    def handle_disconnect():
        print("Client disconnected")