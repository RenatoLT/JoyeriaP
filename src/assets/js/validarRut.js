document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;


  function validarRut(rut) {
    rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (!/^(\d{7,8})([0-9K])$/.test(rut)) return false;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvEsperado;
  }


  function validarCorreo(email) {
    const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    return regex.test(email.trim());
  }


  function validarTelefono(telefono) {
    const regex = /^[+]\d{9,12}$/;
    return regex.test(telefono.trim());
  }

  function mostrarError(input, mensaje) {
    input.classList.add('is-invalid');
    let error = input.parentNode.querySelector('.invalid-feedback');
    if (!error) {
      error = document.createElement('div');
      error.className = 'invalid-feedback';
      input.parentNode.appendChild(error);
    }
    error.textContent = mensaje;
  }

  function limpiarError(input) {
    input.classList.remove('is-invalid');
    let error = input.parentNode.querySelector('.invalid-feedback');
    if (error) error.remove();
  }

  form.addEventListener('submit', function (e) {
    let valido = true;


    const rutInput = form.elements['rut'];
    if (!validarRut(rutInput.value.trim())) {
      mostrarError(rutInput, 'RUT inválido');
      valido = false;
    } else {
      limpiarError(rutInput);
    }


    const correoInput = form.elements['correo'];
    if (!validarCorreo(correoInput.value.trim())) {
      mostrarError(correoInput, 'Correo electrónico inválido');
      valido = false;
    } else {
      limpiarError(correoInput);
    }


    const telefonoInput = form.elements['telefono'];
    if (!validarTelefono(telefonoInput.value.trim())) {
      mostrarError(telefonoInput, 'Número de teléfono inválido (solo dígitos, 9-12 caracteres)');
      valido = false;
    } else {
      limpiarError(telefonoInput);
    }


    ['nombre', 'duda'].forEach(function (campo) {
      const input = form.elements[campo];
      if (!input.value.trim()) {
        mostrarError(input, 'Este campo es obligatorio');
        valido = false;
      } else {
        limpiarError(input);
      }
    });

    if (!valido) {
      e.preventDefault();
    }
  });

  form.elements['rut'].addEventListener('input', function () {
    if (validarRut(this.value.trim())) limpiarError(this);
  });
  form.elements['correo'].addEventListener('input', function () {
    if (validarCorreo(this.value.trim())) limpiarError(this);
  });
  form.elements['telefono'].addEventListener('input', function () {
    if (validarTelefono(this.value.trim())) limpiarError(this);
  });
});