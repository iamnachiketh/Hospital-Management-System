interface IUser {
    name: string;
    email: string;
    phone?: string;
    image?: string;
    address?: {
        line1: string;
        line2: string;
    };
    gender?: string;
    dob?: string;
    password: string;
    medicalHistory: string;
    previousMedication?: string;
}

export default IUser;