import * as yup from 'yup';

const tokenCreationSchema = yup.object().shape({
  name: yup.string().max(32).required(),
  description: yup.string().max(4096).required(),
  supply: yup.number().required().positive().integer().max(200000000),
  url: yup.string().url('must be a valid URL'),
  royalty: yup.number().integer().min(0).max(100),
  id: yup.string(),

  confirmation: yup.boolean().oneOf([true], ''),

  dataAsJson: yup.object().shape({
    constellation_name: yup.string().max(32),
    number_in_constellation: yup.number().min(1),
  }),

  dataAsJsonUnformatted: yup.array().of(
    yup.object().shape({
      key: yup.string().required(),
      value: yup.string().required(),
    })
  ),
});

export default tokenCreationSchema;
