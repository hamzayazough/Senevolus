from flask_socketio import emit, join_room
from flask import Flask, request
from models.user_model import get_user_by_id, add_user
from models.task_model import get_tasks_by_elder, get_tasks_by_volunteer, get_tasks_by_status, get_tasks_by_volunteer_and_status, create_task, update_task, delete_task
messages = []


def socketio_handlers(socketio):
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
        taskListPending = get_tasks_by_status("published")
        taskListAccepted = get_tasks_by_volunteer_and_status(data,"accepted")
        emit('gotListVolunteer', {'task': taskListPending + taskListAccepted}, to=request.sid)
    
    @socketio.on('getMessages')
    def getMessages():
        emit('gotMessages', messages, to=request.sid)

    @socketio.on('sendMessage')
    def sendMessage(data):
        messages.insert(0, data)
        emit('gotMessages', messages, broadcast=True)

    @socketio.on('disconnect')
    def handle_disconnect():
        print("Client disconnected")

    @socketio.on('taskCreated')
    def createTask(data):
        create_task(data['task'])
        task = data['task']
        taskList = get_tasks_by_elder(task['elder_id'])
        print(task['elder_id'])
        emit('gotListElder', {'task': taskList})

    @socketio.on('taskAccepted')
    def acceptTask(data):
        updates = {
            "volunteer_id":data['volunteer_id'],
            "status":"accepted"
        }
        update_task(data['task_id'], updates)

        taskList = get_tasks_by_elder(data['elder_id'])
        emit('gotListElder', {'task': taskList})

        taskListPending = get_tasks_by_status("published")
        taskListAccepted = get_tasks_by_volunteer_and_status(data['volunteer_id'],"accepted")
        emit('gotListVolunteer', {'task': taskListPending + taskListAccepted})


    @socketio.on('taskRemoved')
    def removeTask(data):
        delete_task(data['task_id'])
        
        taskList = get_tasks_by_elder(data['elder_id'])
        emit('gotListElder', {'task': taskList})

        taskListPending = get_tasks_by_status("published")
        taskListAccepted = get_tasks_by_volunteer_and_status(data['volunteer_id'],"accepted")
        emit('gotListVolunteer', {'task': taskListPending + taskListAccepted})


    



