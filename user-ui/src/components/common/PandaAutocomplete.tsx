import React from 'react';
import {
  Autocomplete as MuiAutocomplete,
  TextField,
  Chip,
  useTheme,
  AutocompleteRenderInputParams,
  AutocompleteRenderGetTagProps,
  AutocompleteProps,
  PaperProps,
  PopperProps,
  ListProps,
  ChipProps,
} from '@mui/material';
import { themeUtils } from '../../theme';

export interface AutocompleteOption {
  label: string;
  value: string;
}

type BaseAutocompleteProps = Omit<
  AutocompleteProps<AutocompleteOption, boolean, boolean, boolean>,
  'renderInput' | 'onChange' | 'value' | 'getOptionLabel'
>;

interface PandaAutocompleteProps extends BaseAutocompleteProps {
  value: AutocompleteOption[];
  onChange: (value: AutocompleteOption[]) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  className?: string;
  style?: React.CSSProperties;
  limitTags?: number;
  freeSolo?: boolean;
  multiple?: boolean;
  disableCloseOnSelect?: boolean;
  clearOnBlur?: boolean;
  selectOnFocus?: boolean;
  handleHomeEndKeys?: boolean;
  blurOnSelect?: boolean | 'touch' | 'mouse';
  clearOnEscape?: boolean;
  disablePortal?: boolean;
  openOnFocus?: boolean;
  autoComplete?: boolean;
  autoHighlight?: boolean;
  autoSelect?: boolean;
  includeInputInList?: boolean;
  filterSelectedOptions?: boolean;
  groupBy?: (option: AutocompleteOption) => string;
  getOptionDisabled?: (option: AutocompleteOption) => boolean;
  renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: AutocompleteOption) => React.ReactNode;
  renderTags?: (value: AutocompleteOption[], getTagProps: AutocompleteRenderGetTagProps) => React.ReactNode;
  noOptionsText?: React.ReactNode;
  loadingText?: React.ReactNode;
  loading?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?: (event: React.SyntheticEvent, reason: string) => void;
  onInputChange?: (event: React.SyntheticEvent, value: string, reason: string) => void;
  onHighlightChange?: (event: React.SyntheticEvent, option: AutocompleteOption | null, reason: string) => void;
  popupIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
  forcePopupIcon?: boolean | 'auto';
  disableClearable?: boolean;
  open?: boolean;
  defaultValue?: AutocompleteOption[];
  filterOptions?: (options: AutocompleteOption[], state: { inputValue: string }) => AutocompleteOption[];
  PaperComponent?: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
  PopperComponent?: React.ComponentType<PopperProps>;
  ListboxComponent?: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
  ListboxProps?: ListProps;
  ChipProps?: ChipProps;
  inputValue?: string;
  id?: string;
  getOptionLabel?: (option: string | AutocompleteOption) => string;
}

const PandaAutocomplete: React.FC<PandaAutocompleteProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  error,
  helperText,
  disabled,
  required,
  fullWidth,
  size,
  variant,
  className,
  style,
  limitTags,
  freeSolo,
  multiple,
  disableCloseOnSelect,
  clearOnBlur,
  selectOnFocus,
  handleHomeEndKeys,
  blurOnSelect,
  clearOnEscape,
  disablePortal,
  openOnFocus,
  autoComplete,
  autoHighlight,
  autoSelect,
  includeInputInList,
  filterSelectedOptions,
  groupBy,
  getOptionDisabled,
  renderOption,
  renderTags,
  noOptionsText,
  loadingText,
  loading,
  onOpen,
  onClose,
  onInputChange,
  onHighlightChange,
  popupIcon,
  clearIcon,
  forcePopupIcon,
  disableClearable,
  open,
  defaultValue,
  filterOptions,
  PaperComponent,
  PopperComponent,
  ListboxComponent,
  ListboxProps,
  ChipProps,
  inputValue,
  id,
  getOptionLabel = (option: string | AutocompleteOption) => 
    typeof option === 'string' ? option : option.label,
  ...restProps
}) => {
  const theme = useTheme();

  const defaultRenderTags = (
    value: AutocompleteOption[],
    getTagProps: AutocompleteRenderGetTagProps
  ) => {
    return value.map((option, index) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { key: _, ...restTagProps } = getTagProps({ index });
      return (
        <Chip
          key={`${option.value}-${index}`}
          label={option.label}
          {...restTagProps}
          sx={{
            m: 0.5,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '& .MuiChip-deleteIcon': {
              color: theme.palette.primary.main,
            },
          }}
        />
      );
    });
  };

  return (
    <MuiAutocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue as AutocompleteOption[])}
      getOptionLabel={getOptionLabel}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          variant={variant}
          sx={{
            '& .MuiOutlinedInput-root': {
              ...themeUtils.glassEffect(0.1),
              '&:hover': {
                ...themeUtils.glassEffect(0.15),
              },
              '&.Mui-focused': {
                ...themeUtils.glassEffect(0.2),
              },
            },
          }}
        />
      )}
      renderTags={renderTags || defaultRenderTags}
      limitTags={limitTags}
      freeSolo={freeSolo}
      multiple={multiple}
      disableCloseOnSelect={disableCloseOnSelect}
      clearOnBlur={clearOnBlur}
      selectOnFocus={selectOnFocus}
      handleHomeEndKeys={handleHomeEndKeys}
      blurOnSelect={blurOnSelect}
      clearOnEscape={clearOnEscape}
      disablePortal={disablePortal}
      openOnFocus={openOnFocus}
      autoComplete={autoComplete}
      autoHighlight={autoHighlight}
      autoSelect={autoSelect}
      includeInputInList={includeInputInList}
      filterSelectedOptions={filterSelectedOptions}
      groupBy={groupBy}
      getOptionDisabled={getOptionDisabled}
      renderOption={renderOption}
      noOptionsText={noOptionsText}
      loadingText={loadingText}
      loading={loading}
      onOpen={onOpen}
      onClose={onClose}
      onInputChange={onInputChange}
      onHighlightChange={onHighlightChange}
      popupIcon={popupIcon}
      clearIcon={clearIcon}
      forcePopupIcon={forcePopupIcon}
      disableClearable={disableClearable}
      open={open}
      defaultValue={defaultValue}
      filterOptions={filterOptions}
      PaperComponent={PaperComponent}
      PopperComponent={PopperComponent}
      ListboxComponent={ListboxComponent}
      ListboxProps={ListboxProps}
      ChipProps={ChipProps}
      inputValue={inputValue}
      id={id}
      className={className}
      style={style}
      {...restProps}
    />
  );
};

export default PandaAutocomplete; 