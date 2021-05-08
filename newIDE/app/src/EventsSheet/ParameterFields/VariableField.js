// @flow
import OpenInNew from '@material-ui/icons/OpenInNew';
import React, { Component } from 'react';
import RaisedButton from '../../UI/RaisedButton';
import { enumerateVariables } from './EnumerateVariables';
import { type ParameterFieldProps } from './ParameterFieldCommons';
import classNames from 'classnames';
import { icon, nameAndIconContainer } from '../EventsTree/ClassNames';
import SemiControlledAutoComplete, {
  type SemiControlledAutoCompleteInterface,
} from '../../UI/SemiControlledAutoComplete';
import { TextFieldWithButtonLayout } from '../../UI/Layout';
import { type ParameterInlineRendererProps } from './ParameterInlineRenderer.flow';

type Props = {
  ...ParameterFieldProps,
  variablesContainer: ?gdVariablesContainer,
  onOpenDialog: ?() => void,
};

export default class VariableField extends Component<Props, {||}> {
  _field: ?SemiControlledAutoCompleteInterface;

  focus() {
    if (this._field) this._field.focus();
  }

  render() {
    const {
      value,
      onChange,
      isInline,
      onOpenDialog,
      parameterMetadata,
      variablesContainer,
      onRequestClose,
    } = this.props;

    const description = parameterMetadata
      ? parameterMetadata.getDescription()
      : undefined;

    return (
      <TextFieldWithButtonLayout
        renderTextField={() => (
          <SemiControlledAutoComplete
            margin={this.props.isInline ? 'none' : 'dense'}
            floatingLabelText={description}
            helperMarkdownText={
              parameterMetadata
                ? parameterMetadata.getLongDescription()
                : undefined
            }
            fullWidth
            value={value}
            onChange={onChange}
            onRequestClose={onRequestClose}
            dataSource={enumerateVariables(variablesContainer)
              .map(({ name, isValidName }) =>
                isValidName
                  ? {
                      text: name,
                      value: name,
                    }
                  : // Hide invalid variable names - they would not
                    // be parsed correctly anyway.
                    null
              )
              .filter(Boolean)}
            openOnFocus={!isInline}
            ref={field => (this._field = field)}
          />
        )}
        renderButton={style =>
          onOpenDialog && !isInline ? (
            <RaisedButton
              icon={<OpenInNew />}
              disabled={!this.props.variablesContainer}
              primary
              style={style}
              onClick={onOpenDialog}
            />
          ) : null
        }
      />
    );
  }
}

export const renderVariableWithIcon = (
  {
    value,
    parameterMetadata,
    MissingParameterValue,
  }: ParameterInlineRendererProps,
  iconPath: string,
  tooltip: string
) => {
  if (!value && !parameterMetadata.isOptional()) {
    return <MissingParameterValue />;
  }

  return (
    <span
      title={tooltip}
      className={classNames({
        [nameAndIconContainer]: true,
      })}
    >
      <img
        className={classNames({
          [icon]: true,
        })}
        src={iconPath}
        alt=""
      />
      {value}
    </span>
  );
};
