import { useContext } from 'react';
import { useRecoilState } from 'recoil';

import { recordStoreFamilySelector } from '@/object-record/record-store/states/selectors/recordStoreFamilySelector';

import { FieldContext } from '../../contexts/FieldContext';
import { useFieldInitialValue } from '../../hooks/useFieldInitialValue';
import { usePersistField } from '../../hooks/usePersistField';
import { FieldFullNameValue } from '../../types/FieldMetadata';
import { assertFieldMetadata } from '../../types/guards/assertFieldMetadata';
import { isFieldFullName } from '../../types/guards/isFieldFullName';
import { isFieldFullNameValue } from '../../types/guards/isFieldFullNameValue';

export const useFullNameField = () => {
  const { entityId, fieldDefinition, hotkeyScope } = useContext(FieldContext);

  assertFieldMetadata('FULL_NAME', isFieldFullName, fieldDefinition);

  const fieldName = fieldDefinition.metadata.fieldName;

  const [fieldValue, setFieldValue] = useRecoilState<FieldFullNameValue>(
    recordStoreFamilySelector({
      recordId: entityId,
      fieldName: fieldName,
    }),
  );

  const persistField = usePersistField();

  const persistFullNameField = (newValue: FieldFullNameValue) => {
    if (!isFieldFullNameValue(newValue)) {
      return;
    }

    persistField(newValue);
  };

  const fieldInitialValue = useFieldInitialValue();

  const initialValue: FieldFullNameValue = fieldInitialValue?.isEmpty
    ? { firstName: '', lastName: '' }
    : fieldValue;

  return {
    fieldDefinition,
    fieldValue,
    initialValue,
    setFieldValue,
    hotkeyScope,
    persistFullNameField,
  };
};
