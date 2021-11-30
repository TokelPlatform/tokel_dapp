import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toSatoshi } from 'satoshi-bitcoin';
import { selectUnspentBalance } from 'store/selectors';
import { FEE, RESERVED_TOKEL_ARBITRARY_KEYS } from 'vars/defines';
import * as yup from 'yup';

const useTokenCreationSchema = () => {
  const balance = useSelector(selectUnspentBalance);
  const maxSupply = useMemo(() => toSatoshi(balance) - toSatoshi(FEE), [balance]);

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().max(32).required(),
        description: yup.string().max(4096).required(),
        supply: yup
          .number()
          .required()
          .positive()
          .integer()
          .max(maxSupply, 'not enough TKL in wallet'),
        url: yup.string().url('must be a valid URL'),
        royalty: yup.number().min(0).max(99.9),
        id: yup.number().positive().integer().max(999999, 'ID can have a max lenght of 6 digits'),

        confirmation: yup.boolean().oneOf([true], ''),

        dataAsJson: yup.object().shape({
          collection_name: yup.string().max(32),
          number_in_collection: yup.number().min(1),
        }),

        arbitraryAsJsonUnformatted: yup.array().of(
          yup.object().shape({
            key: yup
              .string()
              .required('required')
              .notOneOf(RESERVED_TOKEL_ARBITRARY_KEYS, 'invalid key'),
            value: yup.string().required('required'),
          })
        ),
      }),
    [maxSupply]
  );

  return schema;
};

export default useTokenCreationSchema;
