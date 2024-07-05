import { Server } from "socket.io";
import { PatientEvent } from "./models/patient.event";

const io = new Server({
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New connection: ", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("getUserRooms", (callback: (rooms: string[]) => void) => {
    const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
    callback(rooms);
    console.log(`User ${socket.id} requested rooms`);
  });

  socket.on("patientEvent", (patientEvent: PatientEvent) => {
    io.to(patientEvent.patientId).emit("patientEvent", patientEvent);
    console.log(`User ${socket.id} sent event: ${patientEvent.event}`);
  });

  // WebRTC

  socket.on("setupWebRTCConnection", (patientId: string) => {
    io.to(patientId).emit("setupWebRTCConnection", socket.id);
  });

  socket.on("closeWebRTCConnection", (patientId: string) => {
    io.to(patientId).emit("closeWebRTCConnection", socket.id);
  });

  socket.on("patientWebRTCSignal", (patientId: string, signal: any) => {
    io.to(patientId).emit("patientWebRTCSignal", socket.id, signal);
  });

  socket.on(
    "caregiverWebRTCSignal",
    (socketId: string, patientId: string, signal: any) => {
      io.to(socketId).emit("caregiverWebRTCSignal", patientId, signal);
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

io.listen(3000);
