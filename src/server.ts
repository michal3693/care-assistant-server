import { Server } from "socket.io";
import { PatientEventsEnum } from "./models/patient-events.enum";

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

  socket.on("patientEvent", (event: PatientEventsEnum) => {
    const rooms = Array.from(socket.rooms);
    io.to(rooms[1]).emit("patientEvent", event, rooms[1]);
    console.log(`User ${socket.id} sent event: ${event}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

io.listen(3000);
