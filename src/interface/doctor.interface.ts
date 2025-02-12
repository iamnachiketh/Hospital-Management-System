interface IDoctor {
    name: string;
    email: string;
    password: string;
    image: string;
    speciality: string;
    degree: string;
    experience: string;
    about: string;
    available?: boolean;
    fees: number;
    slots_booked?: Record<string, any>;
    address: {
        line1: string;
        line2: string;
    };
    date: number;
}

export default IDoctor;