import { Select, Stack, Text } from '@sanity/ui';
import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import {
  PatchEvent,
  type StringInputProps,
  set,
  unset,
  useFormCallbacks,
  useFormValue,
} from 'sanity';
import { COUNTRY_SELECT_OPTIONS, getCountryByCode, getCountryByName } from '../constants/countries';

/** Country name dropdown that syncs hidden `countryCode` on the same document. */
export function CountryNameWithIsoField(props: StringInputProps) {
  const { value, onChange } = props;
  const { onChange: patchDocument } = useFormCallbacks();
  const countryCode = useFormValue(['countryCode']) as string | undefined;

  const handleSelect = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const name = event.currentTarget.value;
      if (!name) {
        onChange(unset());
        patchDocument(PatchEvent.from([unset(['countryCode'])]));
        return;
      }
      const country = getCountryByName(name);
      onChange(set(name));
      if (country) {
        patchDocument(PatchEvent.from([set(country.code, ['countryCode'])]));
      }
    },
    [onChange, patchDocument],
  );

  const code = countryCode?.trim().toUpperCase() || getCountryByName(value)?.code;

  return (
    <Stack space={2}>
      <Select value={value ?? ''} onChange={handleSelect}>
        <option value=''>Select country…</option>
        {COUNTRY_SELECT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.title}
          </option>
        ))}
      </Select>
      {code ? (
        <Text size={1} muted>
          ISO: {code}
          {getCountryByCode(code)?.name ? ` · ${getCountryByCode(code)?.name}` : ''}
        </Text>
      ) : null}
    </Stack>
  );
}
