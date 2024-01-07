function numeroEnPalabras(num) {
    const MAX_VALUE = 9999999999;  // Define the maximum allowable value
    
    // Check if the input number exceeds the max value
    if (num > MAX_VALUE) {
        return 'El número es demasiado grande.';  // Return an error message
    }
    const unidades = ['Cero', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince', 'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve'];
    const decenas = ['', '', 'Veinte', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa'];
    const cientos = ['Cien', 'Ciento', 'Doscientos', 'Trescientos', 'Cuatrocientos', 'Quinientos', 'Seiscientos', 'Setecientos', 'Ochocientos', 'Novecientos'];
    const miles = ['', 'Mil', 'Millón', 'Mil Millones', 'Billón', 'Mil Billones'];
    
    if (num === 0) return 'Cero';
    
    let palabra = '';
    let contadorTrozos = 0;
    
    while (num > 0) {
        const trozo = num % 1000;
        if (trozo > 0) {
            let millon = miles[contadorTrozos];
            
            if (contadorTrozos === 2) {
                if (trozo === 1) {
                    millon = 'Un Millón';
                } else {
                    millon = `${trozoEnPalabras(trozo, unidades, decenas, cientos)} Millones`;
                }
            } else if (contadorTrozos !== 0 && trozo === 1) {
                millon = miles[contadorTrozos];
            } else {
                millon = `${trozoEnPalabras(trozo, unidades, decenas, cientos)} ${millon}`;
            }
            
            palabra = `${millon} ${palabra}`.trim();
        }
        num = Math.floor(num / 1000);
        contadorTrozos++;
    }
    
    return palabra;
}

function trozoEnPalabras(trozo, unidades, decenas, cientos) {
    let palabra = '';
    
    const centenas = Math.floor(trozo / 100);
    const resto = trozo % 100;
    
    if (centenas > 0) {
        if (centenas === 1 && resto === 0) {
            palabra += 'Cien';  // Here is the special case when it is exactly 100
        } else {
            palabra += `${cientos[centenas]} `;
        }
    }
    
    if (resto < 20) {
        if (resto !== 0 || trozo === 0) {  // Exclude the "Cero" for the last chunk
            palabra += unidades[resto];
        }
    } else {
        const decena = Math.floor(resto / 10);
        const unidad = resto % 10;
        
        if (decena === 2 && unidad > 0) {
            palabra += `Veinti${unidades[unidad]}`;
        } else {
            if (unidad === 0) {
                palabra += `${decenas[decena]}`;
            } else {
                palabra += `${decenas[decena]} y ${unidades[unidad]}`;
            }
        }
    }
    
    return palabra.trim();
}

function decimalesEnPalabras(decimales, unidades, decenas) {
    // If the decimal part is a single digit or starts with a zero
    if (decimales.length === 1 || decimales.startsWith('0')) {
        return unidades[parseInt(decimales, 10)];
    }

    // If the decimal part has two digits
    let decena = parseInt(decimales.substring(0, 1), 10);
    let unidad = parseInt(decimales.substring(1, 2), 10);
    let palabras = '';

    if (decena === 1) { // For numbers between 10 and 19
        palabras = unidades[10 + unidad];
    } else { // For numbers 20 and above
        if (unidad === 0) {
            palabras = decenas[decena];
        } else {
            palabras = decenas[decena] + ' y ' + unidades[unidad];
        }
    }
    return palabras;
}

// Select elements with new data attributes
const entradaNumero = document.querySelector('[fc-number-text="number"]');
const salidaPalabra = document.querySelector('[fc-number-text="word"]');

entradaNumero.addEventListener('input', function() {
  let rawValue = this.value.replace(/,/g, ''); // Remove commas for processing
  let parts = rawValue.split('.');
  let numPart = parseInt(parts[0], 10);

  let wordRepresentation = '';

  if (!isNaN(numPart)) {
    wordRepresentation = numeroEnPalabras(numPart) + ' pesos';
  }

  // Handling the decimal part
  if (parts.length > 1) {
    let decimalPart = parts[1];

    // Limit decimal part to 2 digits
    if (decimalPart.length > 2) {
      decimalPart = decimalPart.substring(0, 2);
    }

    // Check if decimal part is empty or '00'
    if (!decimalPart || decimalPart === '00') {
      wordRepresentation += ' con cero centavos';
    } else {
      // Convert decimal part to words
      wordRepresentation += ' con ' + decimalesEnPalabras(decimalPart, ['Cero', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'], ['', '', 'Veinte', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta', 'Setenta', 'Ochenta', 'Noventa']) + ' centavos';
    }
  } else {
    wordRepresentation += ' con cero centavos'; // Append for whole numbers
  }

  salidaPalabra.value = wordRepresentation;
});

// Format the number with commas when the user moves out of the input field
entradaNumero.addEventListener('blur', function() {
  if (this.value) {
    this.value = parseFloat(this.value.replace(/,/g, '')).toLocaleString('en-US');
  }
});

document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();
});
