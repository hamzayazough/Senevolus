from flask_socketio import emit, join_room

def socketio_handlers(socketio):
    @socketio.on('send_message')
    def send_message(data):
        room = data['task_id']
        emit('new_message', data, to=room)

    @socketio.on('join_room')
    def join_task_chat(data):
        room = data['task_id']
        join_room(room)
        emit('chat_notification', {"message": f"{data['username']} joined the room"}, to=room)

    @socketio.on('task_status_change')
    def task_status_change(data):
        room = data['elder_id']
        emit('task_update', data, to=room)
