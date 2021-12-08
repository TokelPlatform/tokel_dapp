import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { toSatoshi } from 'satoshi-bitcoin';
import * as yup from 'yup';

import { selectUnspentBalance } from 'store/selectors';
import { EXTRACT_IPFS_HASH_REGEX, FEE, RESERVED_TOKEL_ARBITRARY_KEYS, TICKER } from 'vars/defines';

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
          .max(maxSupply, `not enough ${TICKER} in wallet`),
        url: yup.lazy(val =>
          val?.match(EXTRACT_IPFS_HASH_REGEX)
            ? yup.string().matches(EXTRACT_IPFS_HASH_REGEX, 'must be a valid URL')
            : yup.string().url('must be a valid URL')
        ),
        royalty: yup
          .number()
          .positive()
          .min(0)
          .max(99.9)
          .test(
            'one-decimal',
            'can only have one decimal place',
            value => !value || Number.isInteger(value * 10)
          ),
        id: yup
          .number()
          .positive()
          .integer()
          .max(999999, 'ID can have a max length of 6 digits')
          .test(
            'only-numbers',
            'not a valid ID',
            value => !value || /^[0-9]*$/.test(value?.toString())
          ),

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
