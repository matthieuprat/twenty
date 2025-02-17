import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { isFieldFullName } from '@/object-record/field/types/guards/isFieldFullName';
import { isFieldNumber } from '@/object-record/field/types/guards/isFieldNumber';
import { isFieldText } from '@/object-record/field/types/guards/isFieldText';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';

import { FieldContext } from '../../contexts/FieldContext';

export const useChipField = () => {
  const { entityId, fieldDefinition } = useContext(FieldContext);

  const objectNameSingular =
    isFieldText(fieldDefinition) ||
    isFieldFullName(fieldDefinition) ||
    isFieldNumber(fieldDefinition)
      ? fieldDefinition.metadata.objectMetadataNameSingular
      : undefined;

  const record = useRecoilValue(recordStoreFamilyState(entityId));

  return {
    objectNameSingular,
    record,
  };
};
