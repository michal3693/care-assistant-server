import { Server } from "socket.io";
import { PatientEventEnum } from "./models/patient-event.enum";

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

  socket.on("patientEvent", (roomId: string, event: PatientEventEnum) => {
    console.log(`User ${socket.id} sent event: ${event}`);
    io.to(roomId).emit("patientEvent", event);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

io.listen(3000);
