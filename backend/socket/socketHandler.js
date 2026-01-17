import ActivityLog from "../models/ActivityLog.js";

const roomUsers = new Map(); 

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    
    // 1. JOIN ROOM
    socket.on('join_room', async ({ roomId, userName }) => {
      socket.join(roomId);
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      if (!roomUsers.has(roomId)) roomUsers.set(roomId, []);
      const users = roomUsers.get(roomId);
      
      
      const existingIdx = users.findIndex(u => u.socketId === socket.id);
      if (existingIdx !== -1) users.splice(existingIdx, 1);
      
      users.push({ socketId: socket.id, userName, color });
      
      // Broadcast Update
      io.in(roomId).emit('room_users_update', users);

      // Log & Notify
      ActivityLog.create({ roomId, user: userName, action: 'Joined the session' });
      socket.to(roomId).emit('activity_log', { user: userName, action: 'Joined', timestamp: new Date() });
      
      // Send History
      try {
        const history = await ActivityLog.find({ roomId }).sort({ createdAt: 1 }).limit(50);
        socket.emit('load_previous_logs', history);
      } catch (e) { console.error(e); }
    });

  
    socket.on('leave_room', ({ roomId, userName }) => {
      socket.leave(roomId);
      
      if (roomUsers.has(roomId)) {
        const users = roomUsers.get(roomId);
        const idx = users.findIndex(u => u.socketId === socket.id);
        
        if (idx !== -1) {
          users.splice(idx, 1);
          
          // Immediate Broadcast
          io.in(roomId).emit('room_users_update', users);
          io.in(roomId).emit('activity_log', { user: userName, action: 'Left', timestamp: new Date() });
          
          if (users.length === 0) roomUsers.delete(roomId);
        }
      }
    });

    //  TYPING
    socket.on('typing_start', ({ roomId, userName }) => {
      socket.to(roomId).emit('user_typing', { socketId: socket.id, userName, isTyping: true });
    });

    socket.on('typing_stop', ({ roomId }) => {
      socket.to(roomId).emit('user_typing', { socketId: socket.id, isTyping: false });
    });

    // . SYNC
    socket.on('code_change', ({ roomId, code }) => socket.to(roomId).emit('code_update', code));
    socket.on('language_change', ({ roomId, language }) => socket.to(roomId).emit('language_update', language));

    // . ACTIVITY
    socket.on('trigger_action', ({ roomId, userName, actionType }) => {
      ActivityLog.create({ roomId, user: userName, action: actionType });
      io.in(roomId).emit('activity_log', { user: userName, action: actionType, timestamp: new Date() });
    });

    // . DISCONNECT (Fallback)
    socket.on('disconnect', () => {
      for (const [roomId, users] of roomUsers.entries()) {
        const idx = users.findIndex(u => u.socketId === socket.id);
        if (idx !== -1) {
          const user = users[idx];
          users.splice(idx, 1);
          io.in(roomId).emit('room_users_update', users);
          io.in(roomId).emit('activity_log', { user: user.userName, action: 'Disconnected', timestamp: new Date() });
          if (users.length === 0) roomUsers.delete(roomId);
          break;
        }
      }
    });
  });
};