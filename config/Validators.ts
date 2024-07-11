const registerValidationRules: any = {
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
        condition: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
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


  const userEditValidationRules: any = {
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
        condition: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'El formato del correo electrónico no es válido.',
      },
    ],
  
  };
  
  

  const loginValidationRules: any = {
    email: [
      {
        condition: (value: string) => value.length > 0,
        message: 'Por favor, ingresa tu correo electrónico.',
      },
      {
        condition: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'El formato del correo electrónico no es válido.',
      },
    ],
    password: [
      {
        condition: (value: string) => value.length > 0,
        message: 'Por favor, ingresa una contraseña.',
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




  const createPremioValidationRules: any = {
    descripcion: [
        {
            condition: (value: string) => value.length > 0,
            message: 'Por favor, ingresa una descripción para el premio.',
        },
        {
            condition: (value: string) => value.length < 100,
            message: 'La descripción del premio es demasiado larga.',
        },
    ],
    loteria: [
        {
            condition: (value: string) => value.length > 0,
            message: 'Por favor, ingresa el nombre de la lotería.',
        },
    ],
    fecha: [
        {
            condition: (value: string) => value.length > 0,
            message: 'Por favor, selecciona una fecha para el premio.',
        },
     
    ],
};





const createRifaValidationRules: any = {
  titulo: [
      {
          condition: (value: string) => value.length > 0,
          message: 'Por favor, ingresa un título para la rifa.',
      },
      {
          condition: (value: string) => value.length < 100,
          message: 'El título de la rifa es demasiado largo.',
      },
  ],
 /* pais: [
      {
          condition: (value: string) => value.length > 0,
          message: 'Por favor, selecciona un país para la rifa.',
      },
  ],*/
  numeros: [
      {
          condition: (value: number) => value > 0,
          message: 'Por favor, ingresa la cantidad de números para la rifa.',
      },
      {
          condition: (value: number) => value <= 10000,
          message: 'La cantidad de números para la rifa no puede exceder 10000.',
      },
  ],
  precio: [
    {
        condition: (value: number) => value > 0,
        message: 'Por favor, ingresa el precio unitario de los cupos.',
    },
    {
        condition: (value: number) => value <= 10000,
        message: 'Actualmente la cantidad maxima por cupo radica en 10000.',
    },
],
  tipo: [
      {
          condition: (value: string) => value.length > 0,
          message: 'Por favor, selecciona un tipo de rifa.',
      },
  ],
};


const compradorValidationRules: any = {
  name: [
    {
      condition: (value: string) => value.length > 0,
      message: 'Por favor, ingresa el nombre.',
    },
  ],
  document: [
    {
      condition: (value: string) => value.length > 0,
      message: 'Por favor, ingresa el documento.',
    },
    {
      condition: (value: string) => value.length >= 6,
      message: 'El documento debe tener al menos 6 caracteres.',
    },
    {
      condition: (value: string) => /^\d+$/.test(value),
      message: 'El documento debe contener solo números.',
    },
  ],
  phone: [
    {
      condition: (value: string) => value.length > 0,
      message: 'Por favor, ingresa el teléfono.',
    },
    {
      condition: (value: string) => /^\+\d+ \d+$/.test(value),
      message: 'El teléfono debe estar en el formato "+xxx xxxxxxxxx".',
    },
    {
      condition: (value: string) => {
        const parts = value.split(' ');
        return parts.length === 2 && parts[1].length >= 8;
      },
      message: 'El teléfono debe tener al menos 8 caracteres después del código del país.',
    },
  ],
  
  email: [
    {
      condition: (value: string) => value.length > 0,
      message: 'Por favor, ingresa el correo electrónico.',
    },
    {
      condition: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'El formato del correo electrónico no es válido.',
    },
  ],
};



  

  const validateField = (fieldName: string, value: string,validationRules:any) => {
    const rules = validationRules[fieldName];
    for (const rule of rules) {
      if (!rule.condition(value)) {
        return rule.message;
      }
    }
    return '';
  };
  
  const validateForm = (values: any, touchedFields: any, validationRules:any) => {
    const newErrors: any = {};
    for (const field in touchedFields) {
      if (touchedFields[field]) {
        const errorMessage = validateField(field, values[field],validationRules);
        if (errorMessage) {
          newErrors[field] = errorMessage;
        }
      }
    }
    return newErrors;
  };
  
  export { validateField, validateForm , registerValidationRules, loginValidationRules,userEditValidationRules,createRifaValidationRules, createPremioValidationRules ,compradorValidationRules };
  