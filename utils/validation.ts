export const validatePhoneNumber = (phoneNumber: string) => {
    const whatsappRegex = /^(?:\+|\d{1})[0-9]{9,13}$/;

    if (!whatsappRegex.test(phoneNumber)) {
        throw new Error('nomor whatsapp tidak valid');
    }

    return { phoneNumber }; // Return an object with extracted parts (optional)
}

export const validatePassword = (password: string) => {
    const Regex = /.{8,}/;

    if (!Regex.test(password)) {
        throw new Error('password minimal memiliki 8 huruf');
    }

    return { password }; // Return an object with extracted parts (optional)
}

export const validateName = (name: string) => {
    const Regex = /^[a-zA-Z]{4,}$/;

    if (!Regex.test(name)) {
        throw new Error('password tidak valid');
    }

    return { name }; // Return an object with extracted parts (optional)
}