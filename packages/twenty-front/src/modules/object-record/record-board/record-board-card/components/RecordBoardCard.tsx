import { ReactNode, useContext, useState } from 'react';
import styled from '@emotion/styled';
import { useRecoilState, useRecoilValue } from 'recoil';

import { RecordChip } from '@/object-record/components/RecordChip';
import { FieldContext } from '@/object-record/field/contexts/FieldContext';
import { useRecordBoardStates } from '@/object-record/record-board/hooks/internal/useRecordBoardStates';
import { RecordBoardCardContext } from '@/object-record/record-board/record-board-card/contexts/RecordBoardCardContext';
import { RecordInlineCell } from '@/object-record/record-inline-cell/components/RecordInlineCell';
import { InlineCellHotkeyScope } from '@/object-record/record-inline-cell/types/InlineCellHotkeyScope';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { IconEye } from '@/ui/display/icon/index';
import { LightIconButton } from '@/ui/input/button/components/LightIconButton';
import { Checkbox, CheckboxVariant } from '@/ui/input/components/Checkbox';
import { AnimatedEaseInOut } from '@/ui/utilities/animation/components/AnimatedEaseInOut';

const StyledBoardCard = styled.div<{ selected: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected ? theme.accent.quaternary : theme.background.secondary};
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.accent.secondary : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  box-shadow: ${({ theme }) => theme.boxShadow.light};
  color: ${({ theme }) => theme.font.color.primary};
  &:hover {
    background-color: ${({ theme, selected }) =>
      selected && theme.accent.tertiary};
    border: 1px solid
      ${({ theme, selected }) =>
        selected ? theme.accent.primary : theme.border.color.medium};
  }
  cursor: pointer;

  .checkbox-container {
    transition: all ease-in-out 160ms;
    opacity: ${({ selected }) => (selected ? 1 : 0)};
  }

  &:hover .checkbox-container {
    opacity: 1;
  }

  .compact-icon-container {
    transition: all ease-in-out 160ms;
    opacity: 0;
  }
  &:hover .compact-icon-container {
    opacity: 1;
  }
`;

const StyledBoardCardWrapper = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

const StyledBoardCardHeader = styled.div<{
  showCompactView: boolean;
}>`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  height: 24px;
  padding-bottom: ${({ theme, showCompactView }) =>
    theme.spacing(showCompactView ? 0 : 1)};
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-right: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(2)};
  transition: padding ease-in-out 160ms;

  img {
    height: ${({ theme }) => theme.icon.size.md}px;
    margin-right: ${({ theme }) => theme.spacing(2)};
    object-fit: cover;
    width: ${({ theme }) => theme.icon.size.md}px;
  }
`;

const StyledBoardCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(2.5)};
  padding-right: ${({ theme }) => theme.spacing(2)};
  span {
    align-items: center;
    display: flex;
    flex-direction: row;
    svg {
      color: ${({ theme }) => theme.font.color.tertiary};
      margin-right: ${({ theme }) => theme.spacing(2)};
    }
  }
`;

const StyledCheckboxContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: end;
`;

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledCompactIconContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const RecordBoardCard = () => {
  const { recordId } = useContext(RecordBoardCardContext);

  const {
    getObjectSingularNameState,
    getIsCompactModeActiveState,
    isRecordBoardCardSelectedFamilyState,
    getVisibleFieldDefinitionsState,
  } = useRecordBoardStates();

  const isCompactModeActive = useRecoilValue(getIsCompactModeActiveState());
  const objectNameSingular = useRecoilValue(getObjectSingularNameState());
  const [isCardInCompactMode, setIsCardInCompactMode] =
    useState(isCompactModeActive);

  const [isCurrentCardSelected, setIsCurrentCardSelected] = useRecoilState(
    isRecordBoardCardSelectedFamilyState(recordId),
  );

  const visibleBoardCardFieldDefinitions = useRecoilValue(
    getVisibleFieldDefinitionsState(),
  );

  const record = useRecoilValue(recordStoreFamilyState(recordId));

  const PreventSelectOnClickContainer = ({
    children,
  }: {
    children: ReactNode;
  }) => (
    <StyledFieldContainer
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </StyledFieldContainer>
  );

  const onMouseLeaveBoard = () => {
    if (isCompactModeActive) {
      setIsCardInCompactMode(true);
    }
  };

  if (!objectNameSingular || !record) {
    return null;
  }

  return (
    <StyledBoardCardWrapper>
      <StyledBoardCard
        selected={isCurrentCardSelected}
        onMouseLeave={onMouseLeaveBoard}
        onClick={() => setIsCurrentCardSelected(!isCurrentCardSelected)}
      >
        <StyledBoardCardHeader showCompactView={isCompactModeActive}>
          <RecordChip objectNameSingular={objectNameSingular} record={record} />
          {isCompactModeActive && (
            <StyledCompactIconContainer className="compact-icon-container">
              <LightIconButton
                Icon={IconEye}
                accent="tertiary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCardInCompactMode(false);
                }}
              />
            </StyledCompactIconContainer>
          )}
          <StyledCheckboxContainer className="checkbox-container">
            <Checkbox
              checked={isCurrentCardSelected}
              onChange={() => setIsCurrentCardSelected(!isCurrentCardSelected)}
              variant={CheckboxVariant.Secondary}
            />
          </StyledCheckboxContainer>
        </StyledBoardCardHeader>
        <StyledBoardCardBody>
          <AnimatedEaseInOut isOpen={!isCardInCompactMode} initial={false}>
            {visibleBoardCardFieldDefinitions.map((fieldDefinition) => (
              <PreventSelectOnClickContainer
                key={fieldDefinition.fieldMetadataId}
              >
                <FieldContext.Provider
                  value={{
                    entityId: recordId,
                    maxWidth: 156,
                    recoilScopeId: recordId + fieldDefinition.fieldMetadataId,
                    isLabelIdentifier: false,
                    fieldDefinition: {
                      fieldMetadataId: fieldDefinition.fieldMetadataId,
                      label: fieldDefinition.label,
                      iconName: fieldDefinition.iconName,
                      type: fieldDefinition.type,
                      metadata: fieldDefinition.metadata,
                    },
                    hotkeyScope: InlineCellHotkeyScope.InlineCell,
                  }}
                >
                  <RecordInlineCell />
                </FieldContext.Provider>
              </PreventSelectOnClickContainer>
            ))}
          </AnimatedEaseInOut>
        </StyledBoardCardBody>
      </StyledBoardCard>
    </StyledBoardCardWrapper>
  );
};
