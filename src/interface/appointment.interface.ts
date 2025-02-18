interface IAppointment {
    patientId: string;
    docId: string;
    slotDate: string;
    slotTime: string;
    patientData: Record<string, any>;
    docData: Record<string, any>;
    amount: number;
    date: number;
    cancelled?: boolean;
    payment?: boolean;
    isCompleted?: boolean;
}

export default IAppointment;
