const validationRules: any = {
    name: [
      {
        condition: (value: string) => value.length > 0,
        message: 'Por favor, ingresa tu nombre.',
      },
      {
        condition: (value: string) => value.length < 60,
        message: 'El nombre es demasiado largo.',
      },
    ],
    domain: [
      {
        condition: (value: string) => value.length > 0,
        message: 'Por favor, ingresa el dominio.',
      },
      {
        condition: (value: string) => value.length > 6,
        message: 'El dominio es demasiado corto.',
      },
      {
        condition: (value: string) => value.length < 40,
        message: 'El dominio es demasiado largo.',
      },
    ],
    phone: [
      {
        condition: (value: string) => value.length > 0,
        message: 'Por favor, ingresa tu teléfono.',
      },
      {
        condition: (value: string) => /^\d{6,15}$/.test(value),
        message: 'El formato del teléfono no es válido.',
      },
    ],
    selectedCode: [
      {
        condition: (value: string) => value.length > 0,
        message: 'Selecciona un código de la lista.',
      },
    ],
    email: [
      {
        condition: (value: string) => value.length > 0,
        message: 'Por favor, ingresa tu correo electrónico.',
      },
      {
        condition: (value: string) => value.includes('@') && value.includes('.'),
        message: 'El formato del correo electrónico no es válido.',
      },
    ],
    password: [
      {
        condition: (value: string) => value.length > 0,
        message: 'Por favor, crea una contraseña.',
      },
      {
        condition: (value: string) => value.length >= 6,
        message: 'La contraseña es demasiado corta.',
      },
      {
        condition: (value: string) => value.length <= 20,
        message: 'La contraseña es demasiado larga.',
      },
    ],
  };
  
  const validateRegisterField = (fieldName: string, value: string) => {
    const rules = validationRules[fieldName];
    for (const rule of rules) {
      if (!rule.condition(value)) {
        return rule.message;
      }
    }
    return '';
  };
  
  const validateRegisterForm = (values: any, touchedFields: any) => {
    const newErrors: any = {};
    for (const field in touchedFields) {
      if (touchedFields[field]) {
        const errorMessage = validateRegisterField(field, values[field]);
        if (errorMessage) {
          newErrors[field] = errorMessage;
        }
      }
    }
    return newErrors;
  };
  
  export { validateRegisterField, validateRegisterForm };
  