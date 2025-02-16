import getCurrencyKey from './getCurrencyKey'
import config from './externalConfig'
import { BigNumber } from 'bignumber.js'


const isEnabled = (currency) => {
  currency = getCurrencyKey(currency, false).toLowerCase()

  if (config && config.opts && config.opts.fee) {
    if ((currency === `token`) && config.opts.fee.erc20) {
      return config.opts.fee.erc20
    } else {
      // TODO: temporary check
      const currencyKey = config.binance && currency === 'bnb' ? 'eth' : currency
  
      if (config.opts.fee[currencyKey]) {
        return config.opts.fee[currencyKey]
      }
    }
  }

  return false
}

const calc = (currency, amount) => {
  const usedAdminFee = isEnabled(currency)

  if (usedAdminFee) {
    let fee = (usedAdminFee.min) ? new BigNumber(usedAdminFee.min).toNumber() : 0

    if (amount && new BigNumber(amount).isGreaterThan(0)) {
      let feeFromAmount = new BigNumber(usedAdminFee.fee).dividedBy(100).multipliedBy(amount)

      if (new BigNumber(usedAdminFee.min).isGreaterThan(feeFromAmount)) feeFromAmount = new BigNumber(usedAdminFee.min)

      fee = feeFromAmount.toNumber() // Admin fee in satoshi
    }

    return fee
  }

  return 0
}

export default {
  isEnabled,
  calc,
}
