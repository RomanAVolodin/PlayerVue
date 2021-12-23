import {
  configure,
  defineRule,
  ErrorMessage,
  Field as VeeField,
  Form as VeeForm,
} from 'vee-validate';
import {
  alpha_spaces as alphaSpaces,
  confirmed,
  email,
  max,
  max_value as maxValue,
  min,
  min_value as minValue,
  not_one_of as excluded,
  required,
} from '@vee-validate/rules';

export default {
  install(app, options) {
    console.log(options);
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);
    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('password_mismatch', confirmed);
    defineRule('excluded', excluded);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `Поле ${ctx.field} обязательно для заполнения`,
          tos: 'Вы должны принять соглашение',
          min: `Поле ${ctx.field} слишком короткое`,
          max: `Поле ${ctx.field} слишком длинное`,
          alpha_spaces: `Поле ${ctx.field} может содержать только буквы и пробелы`,
          email: `Поле ${ctx.field} должно быть адресом почты`,
          min_value: `Поле ${ctx.field} слишком маленькое число`,
          max_value: `Поле ${ctx.field} слишком большое число`,
          excluded: `Это значение не разрешено для поля ${ctx.field}`,
          password_mismatch: 'Пароли не совпадают',
        };
        return messages[ctx.rule.name]
          ? messages[ctx.rule.name] : `Поле ${ctx.field} содержит ошибку`;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: true,
      validateOnModelUpdate: true,
    });
  },
};
