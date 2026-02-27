import React from "react";

import { cn } from "@/lib/utils";

// data
import { countries as AllCountries } from "country-data-list";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";

// types
export type Country =
  | {
      alpha2: string;
      alpha3: string;
      countryCallingCodes: string[];
      currencies: string[];
      emoji: string;
      ioc: string;
      languages: string[];
      name: string;
      status: string;
    }
  | {
      alpha2: string;
      alpha3: string;
      countryCallingCodes: string[];
      currencies: any[];
      ioc: string;
      languages: any[];
      name: string;
      status: string;
      emoji?: undefined;
    };

// constants
import { customCurrencies, allCurrencies } from "@/lib/constants/currencies";
import { Button } from "./ui/button";

interface PhoneSelectProps extends Omit<
  ComboboxPrimitive.Root.Props<string, false>,
  "onValueChange"
> {
  onValueChange?: (value: string) => void;
  onCountrySelect?: (country: Country) => void;
  name: string;
  placeholder?: string;
  currencies?: "custom" | "all";
  variant?: "default" | "small";
  valid?: boolean;
}

const PhoneSelect = React.forwardRef<HTMLButtonElement, PhoneSelectProps>(
  (
    {
      value,
      onValueChange,
      onCountrySelect,
      name,
      placeholder = "Select country",
      currencies = "withdrawal",
      variant = "default",
      valid = true,
      ...props
    },
    ref,
  ) => {
    const [selectedCountry, setSelectedCountry] =
      React.useState<Country | null>(null);

    const uniqueCurrencies = React.useMemo<Country[]>(() => {
      const countryMap = new Map<string, Country>();

      AllCountries.all.forEach((country: Country) => {
        if (country.name && country.emoji && country.countryCallingCodes) {
          let shouldInclude = !!country.countryCallingCodes.length;

          if (shouldInclude) {
            countryMap.set(country.name, {
              ...country,
            });
          }
        }
      });

      // Convert the map to an array and sort by Country name
      return Array.from(countryMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }, [currencies]);

    const handleValueChange = (newValue: string) => {
      const fullCountryData = uniqueCurrencies.find(
        (curr) => curr.alpha3 === newValue.split("(")[0],
      );
      if (fullCountryData) {
        setSelectedCountry(fullCountryData);
        if (onValueChange) {
          onValueChange(newValue);
        }
        if (onCountrySelect) {
          onCountrySelect(fullCountryData);
        }
      }
    };

    void selectedCountry;

    return (
      <Combobox
        items={uniqueCurrencies.map((item) => ({
          label: `${item.emoji} ${item.name}`,
          value: `${item.alpha3}(${item.countryCallingCodes[0]})`,
          callingCode: item.countryCallingCodes[0],
        }))}
        value={value}
        onValueChange={(value) => handleValueChange(value || "")}
        {...props}
        name={name}
        data-valid={valid}
      >
        <ComboboxTrigger
          className={cn("w-full", variant === "small" && "w-fit gap-2")}
          data-valid={valid}
          ref={ref}
          render={
            <Button
              variant="outline"
              className="w-64 justify-between font-normal"
            />
          }
        >
          <ComboboxValue
            placeholder={
              <span className="text-base md:text-sm text-muted-foreground">
                {placeholder}
              </span>
            }
          />
        </ComboboxTrigger>
        <ComboboxContent className="min-w-(--anchor-width)">
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.label} value={item.value || ""}>
                <div className="flex items-center w-full gap-2">
                  <span className="hidden">{item?.symbol}</span>
                  <span>{item.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.callingCode}
                  </span>
                </div>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
);

PhoneSelect.displayName = "PhoneSelect";

export { PhoneSelect };
