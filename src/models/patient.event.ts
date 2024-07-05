import { PatientEventsEnum } from "./patient-events.enum";

export interface PatientEvent {
  event: PatientEventsEnum;
  patientId: string;
  patientName: string;
}
