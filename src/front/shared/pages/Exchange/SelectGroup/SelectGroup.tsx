import React, { Fragment } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

import CSSModules from 'react-css-modules'
import styles from './SelectGroup.scss'
import partialStyles from '../Exchange.scss'
import { constants } from 'helpers'
import config from 'app-config'

import Input from 'components/forms/Input/Input'
import FieldLabel from 'components/forms/FieldLabel/FieldLabel'
import CurrencySelect from 'components/ui/CurrencySelect/CurrencySelect'
import Tooltip from 'components/ui/Tooltip/Tooltip'
import { BigNumber } from 'bignumber.js'

import { inputReplaceCommaWithDot } from 'helpers/domUtils'

const isDark = localStorage.getItem(constants.localStorage.isDark)

// TODO to split data and view this component
const SelectGroup = (props) => {
  const {
    dynamicFee,
    isToken,
    extendedControls,
    selectedValue,
    onSelect,
    currencies,
    fiat,
    placeholder,
    label,
    disabled,
    className,
    inputValueLink,
    tooltip,
    balance,
    error,
    id,
    idFee,
    tooltipAboutFee,
    haveAmount,
    inputToolTip,
    activeFiat,
    balanceTooltip,
  } = props
  return (
    <div styleName="selectGroup">
      <FieldLabel inRow>
        <strong>{label}</strong>
        {tooltip && (
          <span>
            <span>&nbsp;</span>
            <div styleName="smallTooltip">
              <Tooltip id={id}>{tooltip}</Tooltip>
            </div>
          </span>
        )}
      </FieldLabel>
      <div styleName={`groupField ${isDark ? 'dark' : ''}`} className={className}>
        <Input
          styleName="inputRoot"
          inputContainerClassName="inputContainer"
          valueLink={inputValueLink}
          type="number"
          placeholder={placeholder}
          pattern="0-9\."
          errorStyle={error}
          disabled={disabled}
          onFocus={props.onFocus ? props.onFocus : () => {}}
          onBlur={props.onBlur ? props.onBlur : () => {}}
          onKeyDown={inputReplaceCommaWithDot}
        />
        {(selectedValue === 'eth' ||
          selectedValue === 'bnb' ||
          selectedValue === 'btc' ||
          selectedValue === 'ghost' ||
          selectedValue === 'next') &&
          fiat > 0 && (
            <p styleName="textUsd">
              {`~${fiat}`} {activeFiat}
            </p>
          )}
        {inputToolTip && inputToolTip}
        {balanceTooltip && (
          <div styleName="smallTooltip balanceTooltip">
            <Tooltip id="SelectGroupTooltipBalance">{balanceTooltip()}</Tooltip>
          </div>
        )}
        <CurrencySelect
          selectedItemRender={(item) => {
            return (item.name.toUpperCase() === `ETH` && config.binance) ? `BSC` : item.fullTitle
          }}
          styleName="currencySelect"
          placeholder="Enter the name of coin"
          selectedValue={selectedValue}
          onSelect={onSelect}
          currencies={currencies}
        />
      </div>
      {label.props.defaultMessage === 'You sell' &&
        !extendedControls &&
        (balance > 0 ? (
          !isToken && (
            <span
              styleName={
                new BigNumber(haveAmount).isLessThanOrEqualTo(balance) &&
                new BigNumber(balance).isLessThan(new BigNumber(haveAmount).plus(dynamicFee)) &&
                new BigNumber(haveAmount).isGreaterThan(0)
                  ? 'red'
                  : 'balance'
              }
            >
              <FormattedMessage
                id="select75"
                defaultMessage="Available for exchange: {availableBalance} {tooltip}"
                values={{
                  availableBalance: `${new BigNumber(balance).minus(
                    dynamicFee
                  )} ${(selectedValue.toUpperCase() === 'ETH' && config.binance) ? 'BSC' : selectedValue.toUpperCase()}`,
                  tooltip: <Tooltip id={idFee}> {tooltipAboutFee}</Tooltip>,
                }}
              />
            </span>
          )
        ) : (
          <span styleName="textForNull">
            <FormattedMessage
              id="selected53"
              defaultMessage="You can use an external wallet to perform a swap"
            />
          </span>
        ))}
    </div>
  )
}

export default injectIntl(
  CSSModules(SelectGroup, { ...styles, ...partialStyles }, { allowMultiple: true })
)
