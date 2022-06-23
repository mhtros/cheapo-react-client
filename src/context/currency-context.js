import React, { useMemo, useState } from "react";
import { errorToast } from "../helpers/toasts";

const currencyContext = React.createContext({
  locale: "en-US",
  currency: "USD",
  formatter: {},
  setLocale: (locale) => {},
  setCurrency: (currency) => {},
  currencyParser: (value) => {},
});

export const CurrencyContextProvider = (props) => {
  const [locale, setLocale] = useState(
    localStorage.getItem("locale") || "en-US"
  );

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD"
  );

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }),
    [currency, locale]
  );

  const setLocaleHandler = (locale) => {
    setLocale(locale);
    localStorage.setItem("locale", locale);
  };

  const setCurrencyHandler = (currency) => {
    setCurrency(currency);
    localStorage.setItem("currency", currency);
  };

  const currencyParserHandler = (val) => {
    try {
      // for when the input gets clears
      if (typeof val === "string" && !val.length) {
        val = "0.0";
      }

      // detecting and parsing between comma and dot
      var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
      var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
      var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
      reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
      //  => 1232.21 €

      // removing everything except the digits and dot
      reversedVal = reversedVal.replace(/[^0-9.]/g, "");
      //  => 1232.21

      // appending digits properly
      const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
      const needsDigitsAppended = digitsAfterDecimalCount > 2;

      if (needsDigitsAppended) {
        reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
      }

      return Number.isNaN(reversedVal) ? 0 : reversedVal;
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <currencyContext.Provider
      value={{
        locale: locale,
        currency: currency,
        formatter: formatter,
        setLocale: setLocaleHandler,
        setCurrency: setCurrencyHandler,
        currencyParser: currencyParserHandler,
      }}
    >
      {props.children}
    </currencyContext.Provider>
  );
};

export default currencyContext;
