const { validatePassword } = require('../server');

describe('Validación de Contraseña', () => {
    test('Contraseña válida con 10 caracteres, mayúsculas, minúsculas, un número y un carácter especial', () => {
        expect(validatePassword("Password1!")).toBe(true);
    });

    test('Contraseña inválida (menos de 10 caracteres)', () => {
        expect(validatePassword("Pass1!")).toBe(false);
    });

    test('Contraseña inválida (sin mayúsculas)', () => {
        expect(validatePassword("password1!")).toBe(false);
    });

    test('Contraseña inválida (sin minúsculas)', () => {
        expect(validatePassword("PASSWORD1!")).toBe(false);
    });

    test('Contraseña inválida (sin número)', () => {
        expect(validatePassword("Password!")).toBe(false);
    });

    test('Contraseña inválida (sin carácter especial)', () => {
        expect(validatePassword("Password1")).toBe(false);
    });
    test('Contraseña válida con 10 caracteres, mayúsculas, minúsculas, un número y un carácter especial', () => {
        expect(validatePassword("Password1!")).toBe(true);
    });
});
