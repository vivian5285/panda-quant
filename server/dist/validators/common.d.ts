export declare const commonValidators: {
    email: {
        field: string;
        validators: ((value: string) => boolean)[];
    };
    password: {
        field: string;
        validators: ((value: string) => boolean)[];
    };
    requiredString: (field: string) => {
        field: string;
        validators: ((value: string) => boolean | "")[];
    };
};
